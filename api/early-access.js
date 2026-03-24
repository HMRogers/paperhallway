export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = body?.email;
  if (!email || !email.includes("@")) {
    return new Response(
      JSON.stringify({ error: "A valid email address is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Server configuration error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Thank-you email HTML ──────────────────────────────────────────────
  const thankYouHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FCFAF5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FCFAF5;min-height:100vh;">
<tr><td align="center" style="padding:60px 24px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td align="center" style="padding-bottom:48px;">
    <div style="width:20px;height:28px;border:1px solid #3C3730;border-radius:2px;"></div>
  </td></tr>
  <tr><td align="center" style="padding-bottom:32px;">
    <h1 style="margin:0;font-family:Georgia,'Cormorant Garamond',serif;font-size:36px;font-weight:400;color:#3C3730;line-height:1.2;">The door is open.</h1>
  </td></tr>
  <tr><td align="center" style="padding-bottom:32px;">
    <div style="width:80px;height:1px;background-color:#3C3730;opacity:0.15;"></div>
  </td></tr>
  <tr><td style="padding-bottom:24px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#8A8279;">Consider this your key to the corridor. You've been added to the early access list for Paper Hallway &mdash; a quiet, considered space where software is made with the same care as a well-set page.</p>
  </td></tr>
  <tr><td style="padding-bottom:24px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#8A8279;">Behind these doors, we're building things worth your attention: indie games crafted with patience, learning tools designed for genuine curiosity, and quiet apps that bring order without noise.</p>
  </td></tr>
  <tr><td style="padding-bottom:40px;">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#8A8279;">We'll write again when the first doors are ready to open. Until then &mdash; welcome to the hallway.</p>
  </td></tr>
  <tr><td style="padding-bottom:48px;">
    <p style="margin:0 0 4px 0;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:#3C3730;">Warmly,</p>
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#B8B0A6;">The Paper Hallway</p>
  </td></tr>
  <tr><td align="center" style="padding-top:32px;border-top:1px solid rgba(60,55,48,0.08);">
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#B8B0A6;letter-spacing:0.1em;">paperhallway.com</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  // ── Notification email HTML ───────────────────────────────────────────
  const notificationHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#FCFAF5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:480px;margin:0 auto;">
  <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#B8B0A6;margin:0 0 16px 0;">Early Access Request</p>
  <div style="border:1px solid rgba(60,55,48,0.1);border-radius:4px;padding:24px;background:white;">
    <p style="margin:0 0 8px 0;font-size:13px;color:#8A8279;">Someone has requested early access:</p>
    <p style="margin:0;font-size:18px;color:#3C3730;font-family:Georgia,serif;">${email}</p>
  </div>
  <p style="font-size:11px;color:#B8B0A6;margin:24px 0 0 0;letter-spacing:0.1em;">Paper Hallway &middot; Early Access Notification</p>
</div>
</body>
</html>`;

  try {
    // Send thank-you email to user
    const thankYouResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Paper Hallway <hello@paperhallway.com>",
        to: [email],
        subject: "You're inside.",
        html: thankYouHtml,
      }),
    });

    const thankYouData = await thankYouResp.json();

    if (!thankYouResp.ok) {
      console.error("Thank-you email failed:", JSON.stringify(thankYouData));
      return new Response(
        JSON.stringify({ error: "Failed to send confirmation email.", details: thankYouData }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send notification email to hello@paperhallway.com
    // Use a subdomain sender to avoid Resend blocking same-domain self-sends
    const notifResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Paper Hallway Notifications <hello@paperhallway.com>",
        to: ["hello@paperhallway.com"],
        reply_to: email,
        subject: `New Early Access Request: ${email}`,
        html: notificationHtml,
      }),
    });

    let notifWarning = null;
    if (!notifResp.ok) {
      const notifData = await notifResp.json();
      console.error("Notification email failed:", JSON.stringify(notifData));
      notifWarning = notifData;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome to the hallway.", notif_warning: notifWarning }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
