// ─────────────────────────────────────────────────────────────────────────────
// Netlify Serverless Function: Lemon Squeezy Webhook Listener
// Route: POST /.netlify/functions/lemon-webhook
//
// When a user completes a $49 Aether license purchase, Lemon Squeezy sends
// a signed webhook to this endpoint. We verify the signature, extract the
// license key, and the frontend redirect (configured in Lemon Squeezy checkout
// settings as: https://paperhallway.com/office/aether?order_id={order_id}&license_key={license_key})
// handles showing the success page automatically.
//
// This function handles:
//   1. Signature verification (HMAC-SHA256)
//   2. Logging the order for audit purposes
//   3. Returning 200 OK to Lemon Squeezy
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";

const LEMON_WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET;

export const handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // ── Verify Lemon Squeezy signature ─────────────────────────────────────────
  const signature = event.headers["x-signature"];
  if (!signature || !LEMON_WEBHOOK_SECRET) {
    console.error("[lemon-webhook] Missing signature or secret");
    return { statusCode: 401, body: "Unauthorized" };
  }

  const hmac = crypto.createHmac("sha256", LEMON_WEBHOOK_SECRET);
  hmac.update(event.body);
  const digest = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
    console.error("[lemon-webhook] Signature mismatch");
    return { statusCode: 401, body: "Invalid signature" };
  }

  // ── Parse payload ──────────────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const eventName = payload?.meta?.event_name;
  console.log(`[lemon-webhook] Event received: ${eventName}`);

  // ── Handle order_created ───────────────────────────────────────────────────
  if (eventName === "order_created") {
    const order       = payload?.data?.attributes;
    const orderId     = payload?.data?.id;
    const email       = order?.user_email;
    const licenseKeys = payload?.included?.filter(i => i.type === "license-keys");
    const licenseKey  = licenseKeys?.[0]?.attributes?.key ?? "PENDING";

    console.log(`[lemon-webhook] New Aether license: order=${orderId} email=${email} key=${licenseKey}`);

    // NOTE: The redirect URL is configured in Lemon Squeezy checkout settings:
    // Redirect URL: https://paperhallway.com/office/aether?order_id={order_id}&license_key={license_key}
    // Lemon Squeezy interpolates {order_id} and {license_key} automatically.
    // No server-side redirect needed here — the frontend handles the success page.
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
