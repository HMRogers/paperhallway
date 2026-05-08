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

  // ── Welcome to the Studio — Thank-you email HTML ─────────────────────
  const thankYouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F0EDE6;-webkit-font-smoothing:antialiased;">

<!-- Outer wrapper — desk surface -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE6;min-height:100vh;">
<tr><td align="center" style="padding:48px 20px 60px;">

  <!-- Paper letter card -->
  <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background-color:#FCFAF5;border:1px solid rgba(60,55,48,0.08);box-shadow:0 1px 4px rgba(60,55,48,0.04), 0 8px 24px rgba(60,55,48,0.06);">

    <!-- Top margin strip (like letterhead space) -->
    <tr><td style="height:12px;border-bottom:1px solid rgba(60,55,48,0.05);"></td></tr>

    <!-- Letter content -->
    <tr><td style="padding:52px 48px 44px;">

      <!-- Paper Hallway mark -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:44px;">
          <div style="width:20px;height:28px;border:1.5px solid #3C3730;border-radius:2px;opacity:0.4;"></div>
        </td></tr>
      </table>

      <!-- Heading -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:28px;">
          <h1 style="margin:0;font-family:Georgia,'Cormorant Garamond','Times New Roman',serif;font-size:34px;font-weight:400;color:#3C3730;line-height:1.25;letter-spacing:-0.01em;">Welcome to the Studio.</h1>
        </td></tr>
      </table>

      <!-- Divider -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:32px;">
          <div style="width:60px;height:1px;background-color:#3C3730;opacity:0.12;"></div>
        </td></tr>
      </table>

      <!-- Body paragraphs -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:22px;">
          <p style="margin:0;font-family:Georgia,'Cormorant Garamond','Times New Roman',serif;font-size:15.5px;line-height:1.75;color:#6B6560;">Consider this your invitation. You&rsquo;ve joined Paper Hallway Studio &mdash; a quiet, considered space where software is made with the same care as a well-set page.</p>
        </td></tr>
        <tr><td style="padding-bottom:22px;">
          <p style="margin:0;font-family:Georgia,'Cormorant Garamond','Times New Roman',serif;font-size:15.5px;line-height:1.75;color:#6B6560;">The studio is where we build things worth your attention: <strong style="font-weight:600;color:#3C3730;">Aether</strong>, our local AI that reads and organises your files entirely on your machine. <strong style="font-weight:600;color:#3C3730;">Synthese</strong>, the executive content engine that turns one raw video into a month of premium text assets. And more doors opening soon.</p>
        </td></tr>
        <tr><td style="padding-bottom:36px;">
          <p style="margin:0;font-family:Georgia,'Cormorant Garamond','Times New Roman',serif;font-size:15.5px;line-height:1.75;color:#6B6560;">Your first step is waiting. Download Aether, explore the hallway, and make yourself at home.</p>
        </td></tr>
      </table>

      <!-- CTA Button -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:40px;">
          <a href="https://paperhallway.com/#collection" target="_blank" style="display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#FCFAF5;background-color:#3C3730;text-decoration:none;padding:14px 36px;border:1px solid #3C3730;line-height:1;">Enter the Hallway</a>
        </td></tr>
      </table>

      <!-- Signature -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:0;">
          <p style="margin:0 0 5px 0;font-family:Georgia,'Cormorant Garamond','Times New Roman',serif;font-size:16px;font-style:italic;color:#3C3730;">Warmly,</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B8B0A6;">The Paper Hallway</p>
        </td></tr>
      </table>

    </td></tr>

    <!-- Bottom margin strip -->
    <tr><td style="height:12px;border-top:1px solid rgba(60,55,48,0.05);"></td></tr>

  </table>
  <!-- End paper card -->

  <!-- Footer below the letter -->
  <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
    <tr><td align="center" style="padding-top:28px;">
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
  <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#B8B0A6;margin:0 0 16px 0;">New Studio Member</p>
  <div style="border:1px solid rgba(60,55,48,0.1);border-radius:4px;padding:24px;background:white;">
    <p style="margin:0 0 8px 0;font-size:13px;color:#8A8279;">Someone has joined the hallway:</p>
    <p style="margin:0;font-size:18px;color:#3C3730;font-family:Georgia,serif;">${email}</p>
  </div>
  <p style="font-size:11px;color:#B8B0A6;margin:24px 0 0 0;letter-spacing:0.1em;">Paper Hallway &middot; Studio Notification</p>
</div>
</body>
</html>`;

  try {
    // Send welcome email to user
    const thankYouResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Paper Hallway <hello@paperhallway.com>",
        to: [email],
        subject: "Welcome to the Studio.",
        html: thankYouHtml,
      }),
    });

    const thankYouData = await thankYouResp.json();

    if (!thankYouResp.ok) {
      console.error("Welcome email failed:", JSON.stringify(thankYouData));
      return new Response(
        JSON.stringify({ error: "Failed to send confirmation email.", details: thankYouData }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send notification email to hello@paperhallway.com
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
        subject: `New Studio Member: ${email}`,
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
      JSON.stringify({ success: true, message: "Welcome to the studio.", notif_warning: notifWarning }),
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
