import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    // Send message to Telegram
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

    return res.status(200).json({
      message: 'Digest sent to Telegram',
      draft_id: draft.id,
      platform: draft.platform
    });
  } catch (err) {
    console.error('Cron handler error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
