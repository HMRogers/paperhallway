// ─────────────────────────────────────────────────────────────────────────────
// api/activate.js — Aether License Key Retrieval (Fallback)
//
// GET /api/activate?session_id=cs_xxx
//
// When the webhook fails or the email doesn't arrive, this endpoint lets the
// success page generate a license key on-demand by verifying the Stripe
// checkout session directly via the Stripe API.
//
// Environment Variables Required:
//   STRIPE_SECRET_KEY          — Stripe secret key (sk_live_xxx or sk_test_xxx)
//   AETHER_LICENSE_PRIVATE_KEY — ed25519 private key PEM
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";

/**
 * Generate a cryptographically random nonce (16 bytes, hex).
 */
function generateNonce() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Sign a license payload with ed25519.
 * Returns the signature as base64url.
 */
function signLicensePayload(payloadString, privateKeyPem) {
  const sign = crypto.sign(null, Buffer.from(payloadString, "utf8"), {
    key: privateKeyPem,
    format: "pem",
  });
  return sign.toString("base64url");
}

/**
 * Build a license key from payload + signature.
 * Format: base64url(payload).base64url(signature)
 */
function buildLicenseKey(payload, signature) {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64}.${signature}`;
}

export default async function handler(request, response) {
  // CORS headers for the activate page
  response.setHeader("Access-Control-Allow-Origin", "https://paperhallway.com");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const sessionId = request.query.session_id;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return response.status(400).json({ error: "Missing or invalid session_id" });
  }

  // ── Read environment variables ─────────────────────────────────────────
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const AETHER_LICENSE_PRIVATE_KEY = process.env.AETHER_LICENSE_PRIVATE_KEY;

  if (!STRIPE_SECRET_KEY || !AETHER_LICENSE_PRIVATE_KEY) {
    console.error("[Activate] Missing environment variables:", {
      hasStripeKey: !!STRIPE_SECRET_KEY,
      hasLicenseKey: !!AETHER_LICENSE_PRIVATE_KEY,
    });
    return response.status(500).json({ error: "Server configuration error" });
  }

  try {
    // ── Retrieve the Stripe checkout session ───────────────────────────
    const stripeResp = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!stripeResp.ok) {
      const errData = await stripeResp.json().catch(() => ({}));
      console.error("[Activate] Stripe API error:", errData);
      return response.status(404).json({ error: "Checkout session not found" });
    }

    const session = await stripeResp.json();

    // ── Verify the session is paid ──────────────────────────────────────
    if (session.payment_status !== "paid") {
      return response.status(402).json({ error: "Payment not completed" });
    }

    const customerEmail = session.customer_details?.email || session.customer_email || "unknown";
    const customerName = session.customer_details?.name || null;

    // ── Generate the license key ────────────────────────────────────────
    // Use a deterministic nonce based on session_id so the same session
    // always produces the same key (idempotent)
    const deterministicNonce = crypto
      .createHash("sha256")
      .update(`aether-pro-${sessionId}`)
      .digest("hex")
      .substring(0, 32);

    const payload = {
      sub: customerEmail,
      sid: sessionId,
      iat: Math.floor(new Date(session.created * 1000).getTime() / 1000),
      nce: deterministicNonce,
      sku: "aether-pro-v1",
    };

    const payloadString = JSON.stringify(payload);
    const signature = signLicensePayload(payloadString, AETHER_LICENSE_PRIVATE_KEY);
    const licenseKey = buildLicenseKey(payload, signature);

    console.log(`[Activate] License key generated for ${customerEmail} via fallback`);

    return response.status(200).json({
      success: true,
      license_key: licenseKey,
      customer_email: customerEmail,
      customer_name: customerName,
    });
  } catch (err) {
    console.error("[Activate] Error:", err);
    return response.status(500).json({ error: "Internal server error" });
  }
}
