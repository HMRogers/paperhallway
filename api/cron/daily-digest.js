import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate a branded 1080x1080 Instagram-ready image as SVG
function generateBrandedSVG(text) {
  const displayText = text.length > 280 ? text.substring(0, 277) + '...' : text;
  
  const words = displayText.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > 42) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());

  const lineHeight = 38;
  const startY = 540 - (lines.length * lineHeight) / 2;
  const textElements = lines
    .map((line, i) => {
      const escapedLine = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `<text x="540" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#3d3929">${escapedLine}</text>`;
    })
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#f8f6f1"/>
  <rect x="60" y="60" width="960" height="960" fill="none" stroke="#e8e4dc" stroke-width="1"/>
  <text x="540" y="140" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-size="14" fill="#8a8070" letter-spacing="3">PAPER HALLWAY</text>
  <line x1="510" y1="160" x2="570" y2="160" stroke="#c4b99a" stroke-width="1"/>
  <text x="540" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#8a8070" font-style="italic">Synthese · The Executive Content Engine</text>
  <g>
    ${textElements}
  </g>
  <text x="540" y="980" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-size="12" fill="#b0a890">paperhallway.com/synthese</text>
</svg>`;
}

export default async function handler(req, res) {
  // Verify Vercel Cron secret to prevent unauthorized access
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch the next pending draft ordered by scheduled_for
    const { data: drafts, error } = await supabase
      .from('content_queue')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true, nullsFirst: false })
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    }

    if (!drafts || drafts.length === 0) {
      return res.status(200).json({ message: 'No pending drafts in queue' });
    }

    const draft = drafts[0];

    // Build Telegram message with inline keyboard
    const platformLabels = {
      'x': 'X (Twitter)',
      'linkedin': 'LinkedIn',
      'instagram': 'Instagram',
      'both': 'X + LinkedIn',
      'x+instagram': 'X + Instagram',
      'all': 'X + LinkedIn + Instagram'
    };
    const platformLabel = platformLabels[draft.platform] || draft.platform;
    const scheduledLabel = draft.scheduled_for
      ? new Date(draft.scheduled_for).toLocaleString('en-US', { timeZone: 'UTC' })
      : 'Not scheduled';

    const messageText = [
      `📝 *New Draft Awaiting Approval*`,
      ``,
      `*Platform:* ${platformLabel}`,
      `*Scheduled:* ${scheduledLabel}`,
      ``,
      `---`,
      `${draft.content_text}`,
      `---`,
      ``,
      `Tap a button below to approve or reject.`
    ].join('\n');

    const approveUrl = `https://paperhallway.com/api/approve?token=${draft.approval_token}&action=approve`;
    const rejectUrl = `https://paperhallway.com/api/approve?token=${draft.approval_token}&action=reject`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ Approve & Publish', url: approveUrl },
          { text: '❌ Reject', url: rejectUrl }
        ]
      ]
    };

    // Send text message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error('Telegram API error:', telegramResult);
      return res.status(500).json({ error: 'Telegram send failed', details: telegramResult });
    }

    // Generate branded image and send as photo to Telegram for Instagram use
    try {
      const svg = generateBrandedSVG(draft.content_text);
      const svgBuffer = Buffer.from(svg);

      // Upload SVG to Supabase Storage for public URL
      const fileName = `instagram-${draft.id}-${Date.now()}.svg`;
      const { error: uploadError } = await supabase.storage
        .from('instagram-images')
        .upload(fileName, svgBuffer, {
          contentType: 'image/svg+xml',
          upsert: true
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('instagram-images')
          .getPublicUrl(fileName);

        // Send the image URL as a follow-up message
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: `🖼️ *Instagram Image Ready*\n\nBranded image for this post:\n${urlData.publicUrl}\n\n_Save this image and post to Instagram with the caption above._`,
              parse_mode: 'Markdown'
            })
          }
        );
      }
    } catch (imgErr) {
      console.error('Image generation failed (non-critical):', imgErr);
      // Non-critical — don't fail the whole digest
    }

    return res.status(200).json({
      message: 'Digest sent to Telegram with image',
      draft_id: draft.id,
      platform: draft.platform
    });
  } catch (err) {
    console.error('Cron handler error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
