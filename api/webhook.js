// ─────────────────────────────────────────────────────────────────────────────
// api/webhook.js — Aether License Key Factory
//
// Stripe Webhook Endpoint: POST /api/webhook
// Listens for checkout.session.completed events and:
//   1. Verifies the Stripe webhook signature
//   2. Generates a unique license key payload (email + timestamp + nonce)
//   3. Signs the payload with ed25519 (offline-verifiable by the Aether app)
//   4. Sends a "Welcome Architect" email via Resend with the license key
//
// Environment Variables Required:
//   STRIPE_WEBHOOK_SECRET    — Stripe webhook signing secret (whsec_xxx)
//   AETHER_LICENSE_PRIVATE_KEY — ed25519 private key PEM
//   RESEND_API_KEY           — Resend API key for sending emails
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";

// ── Helpers ──────────────────────────────────────────────────────────────────

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
 * This is compact, URL-safe, and the app can split on "." to verify.
 */
function buildLicenseKey(payload, signature) {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64}.${signature}`;
}

/**
 * Format a license key for display in emails.
 * Breaks the key into groups for readability.
 */
function formatKeyForDisplay(licenseKey) {
  // The key is already compact; just return it as-is for copy-paste
  return licenseKey;
}

/**
 * Verify Stripe webhook signature (HMAC-SHA256).
 */
function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader || !secret) return false;

  const elements = sigHeader.split(",");
  let timestamp = null;
  const signatures = [];

  for (const element of elements) {
    const [prefix, value] = element.split("=");
    if (prefix === "t") timestamp = value;
    if (prefix === "v1") signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  // Reject if timestamp is older than 5 minutes
  const tolerance = 300;
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > tolerance) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return signatures.some((sig) =>
    crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"))
  );
}

// ── Welcome Architect Email Template ─────────────────────────────────────────

function buildWelcomeEmail(customerEmail, licenseKey, customerName) {
  const displayName = customerName || "Architect";
  const downloadUrl = "https://paperhallway.com/download/Aether_0.1.0_x64-setup.exe";
  const deepLinkUrl = `aether://activate?license_key=${encodeURIComponent(licenseKey)}`;
  const bridgeUrl = `https://paperhallway.com/activate?license_key=${encodeURIComponent(licenseKey)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FCFAF5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FCFAF5;min-height:100vh;">
<tr><td align="center" style="padding:60px 24px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:12px;">
    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#2c2416,#3d3225);display:flex;align-items:center;justify-content:center;">
      <span style="color:#d4a843;font-size:22px;">&#10022;</span>
    </div>
  </td></tr>

  <!-- Title -->
  <tr><td align="center" style="padding-bottom:8px;">
    <h1 style="margin:0;font-family:Georgia,'Playfair Display',serif;font-size:32px;font-weight:400;color:#2c2416;line-height:1.2;">
      Welcome, ${displayName}.
    </h1>
  </td></tr>

  <tr><td align="center" style="padding-bottom:32px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#8A8279;letter-spacing:0.05em;text-transform:uppercase;">
      You are now an Aether Pro Architect
    </p>
  </td></tr>

  <!-- Divider -->
  <tr><td align="center" style="padding-bottom:32px;">
    <div style="width:80px;height:1px;background-color:#d4a843;opacity:0.4;"></div>
  </td></tr>

  <!-- Intro -->
  <tr><td style="padding-bottom:24px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#5a5347;">
      Your purchase is confirmed. Below is your permanent license key &mdash; it unlocks every Pro feature in Aether, including the Paper Mode theme, unlimited syntheses, and priority processing. This key works entirely offline; Aether will never call home.
    </p>
  </td></tr>

  <!-- License Key Box -->
  <tr><td style="padding-bottom:28px;">
    <div style="background:#2c2416;border-radius:12px;padding:24px 20px;border:1px solid rgba(212,168,67,0.2);">
      <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#d4a843;">
        Your License Key
      </p>
      <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;line-height:1.6;color:#f5f0e8;word-break:break-all;user-select:all;">
        ${licenseKey}
      </p>
    </div>
  </td></tr>

  <!-- Activation Instructions -->
  <tr><td style="padding-bottom:24px;">
    <p style="margin:0 0 12px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2416;">
      How to activate:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;">
          <span style="font-family:Georgia,serif;font-size:14px;color:#d4a843;">1.</span>
        </td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5347;">
          <strong>Automatic:</strong> If Aether is installed, <a href="${bridgeUrl}" style="color:#8b6914;text-decoration:none;border-bottom:1px solid rgba(139,105,20,0.3);">click here to activate instantly</a>.
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;">
          <span style="font-family:Georgia,serif;font-size:14px;color:#d4a843;">2.</span>
        </td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5347;">
          <strong>Manual:</strong> Open Aether &rarr; click the trial badge &rarr; paste your license key.
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Download Button -->
  <tr><td align="center" style="padding-bottom:32px;">
    <a href="${downloadUrl}" style="display:inline-block;padding:14px 36px;border-radius:10px;background:linear-gradient(135deg,#2c2416,#3d3225);color:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;border:1px solid rgba(212,168,67,0.2);box-shadow:0 2px 12px rgba(44,36,22,0.15);">
      Download Aether
    </a>
  </td></tr>

  <!-- Closing -->
  <tr><td style="padding-bottom:40px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#5a5347;">
      Keep this email safe &mdash; your license key is permanent and can be re-entered on any machine. If you ever need help, reply to this email or reach us at <a href="mailto:hello@paperhallway.com" style="color:#8b6914;text-decoration:none;">hello@paperhallway.com</a>.
    </p>
  </td></tr>

  <!-- Sign-off -->
  <tr><td style="padding-bottom:48px;">
    <p style="margin:0 0 4px 0;font-family:Georgia,'Playfair Display',serif;font-size:16px;font-style:italic;color:#2c2416;">Order from Chaos.</p>
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#B8B0A6;">The Paper Hallway</p>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding-top:32px;border-top:1px solid rgba(60,55,48,0.08);">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#B8B0A6;letter-spacing:0.1em;">
      paperhallway.com &middot; Aether &mdash; AI File Intelligence
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Main Handler ─────────────────────────────────────────────────────────────

export default async function handler(request, response) {
  // Only accept POST
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  // ── Read environment variables ─────────────────────────────────────────
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const AETHER_LICENSE_PRIVATE_KEY = process.env.AETHER_LICENSE_PRIVATE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!STRIPE_WEBHOOK_SECRET || !AETHER_LICENSE_PRIVATE_KEY || !RESEND_API_KEY) {
    console.error("[Webhook] Missing environment variables");
    return response.status(500).json({ error: "Server configuration error" });
  }

  // ── Read raw body for signature verification ───────────────────────────
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");

  // ── Verify Stripe signature ────────────────────────────────────────────
  const stripeSignature = request.headers["stripe-signature"];
  if (!verifyStripeSignature(rawBody, stripeSignature, STRIPE_WEBHOOK_SECRET)) {
    console.error("[Webhook] Invalid Stripe signature");
    return response.status(401).json({ error: "Invalid signature" });
  }

  // ── Parse the event ────────────────────────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return response.status(400).json({ error: "Invalid JSON" });
  }

  console.log(`[Webhook] Event received: ${event.type}`);

  // ── Handle checkout.session.completed ──────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || null;
    const sessionId = session.id;
    const amountTotal = session.amount_total;

    if (!customerEmail) {
      console.error("[Webhook] No customer email in session:", sessionId);
      return response.status(200).json({ received: true, warning: "No email found" });
    }

    console.log(`[Webhook] Processing purchase: ${customerEmail} (session: ${sessionId})`);

    // ── Generate the license key ───────────────────────────────────────
    const payload = {
      sub: customerEmail,           // subject (buyer email)
      sid: sessionId,               // Stripe session ID (receipt reference)
      iat: Math.floor(Date.now() / 1000),  // issued-at timestamp
      nce: generateNonce(),         // unique nonce (prevents duplicate keys)
      sku: "aether-pro-v1",        // product identifier
    };

    const payloadString = JSON.stringify(payload);
    const signature = signLicensePayload(payloadString, AETHER_LICENSE_PRIVATE_KEY);
    const licenseKey = buildLicenseKey(payload, signature);

    console.log(`[Webhook] License key generated for ${customerEmail} (${licenseKey.substring(0, 40)}...)`);

    // ── Send the Welcome Architect email ────────────────────────────────
    try {
      const emailHtml = buildWelcomeEmail(customerEmail, licenseKey, customerName);

      const emailResp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Aether by Paper Hallway <hello@paperhallway.com>",
          to: [customerEmail],
          subject: "Welcome, Architect — Your Aether Pro License Key",
          html: emailHtml,
          reply_to: "hello@paperhallway.com",
        }),
      });

      const emailData = await emailResp.json();

      if (!emailResp.ok) {
        console.error("[Webhook] Email send failed:", JSON.stringify(emailData));
        // Don't fail the webhook — Stripe would retry and generate duplicate keys
      } else {
        console.log(`[Webhook] Welcome email sent to ${customerEmail}`);
      }

      // ── Also notify the team ───────────────────────────────────────────
      const notifHtml = `<div style="font-family:sans-serif;padding:20px;">
        <h2 style="color:#2c2416;">New Aether Pro Purchase</h2>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Name:</strong> ${customerName || "N/A"}</p>
        <p><strong>Session:</strong> ${sessionId}</p>
        <p><strong>Amount:</strong> $${(amountTotal / 100).toFixed(2)}</p>
        <p><strong>Key (first 40):</strong> <code>${licenseKey.substring(0, 40)}...</code></p>
      </div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Aether Notifications <hello@paperhallway.com>",
          to: ["hello@paperhallway.com"],
          subject: `Aether Pro Purchase: ${customerEmail}`,
          html: notifHtml,
        }),
      }).catch((e) => console.error("[Webhook] Notification email failed:", e));

    } catch (emailErr) {
      console.error("[Webhook] Email error:", emailErr);
    }

    return response.status(200).json({ received: true, processed: true });
  }

  // ── Acknowledge all other events ───────────────────────────────────────
  return response.status(200).json({ received: true });
}
