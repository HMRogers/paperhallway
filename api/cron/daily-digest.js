import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Hashtag Generation (keyword/category matching) ────────────────────────────

/**
 * Analyzes post text and returns 3–5 relevant hashtags based on keyword matching.
 * Categories: AI, Privacy, SaaS, Founder Life, Automation, Data Sovereignty,
 * Content Creation, B2B, Indie Hacker, No-Code, Local AI, Tech Startup.
 */
function generateHashtags(text) {
  const lower = text.toLowerCase();

  // Each entry: { keywords: [...], hashtag: '#Tag', priority: 1-3 }
  // priority 1 = strongest signal, 3 = weakest
  const rules = [
    // ── AI & Machine Learning ──────────────────────────────────────────────────
    { keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'neural', 'llm', 'large language model', 'gpt', 'claude', 'gemini', 'openai', 'anthropic'], hashtag: '#AI', priority: 1 },
    { keywords: [' ai ', ' ai,', ' ai.', ' ai!', ' ai?', ' ai\n', 'ai-powered', 'ai-driven', 'ai tool', 'ai agent', 'ai model', 'ai system', 'ai solution', 'ai platform', 'ai product', 'ai feature', 'ai workflow', 'ai-first', 'ai-native'], hashtag: '#AI', priority: 1 },
    { keywords: ['aitools', 'ai tools', 'ai assistant', 'ai automation', 'ai writing', 'ai content', 'ai generated', 'ai generation'], hashtag: '#AITools', priority: 2 },
    { keywords: ['local ai', 'local model', 'on-device', 'on device', 'offline ai', 'edge ai', 'private ai', 'run locally', 'runs locally', 'local llm', 'ollama', 'lm studio'], hashtag: '#LocalAI', priority: 1 },

    // ── Privacy & Data Sovereignty ─────────────────────────────────────────────
    { keywords: ['privacy', 'private', 'data privacy', 'privacy-first', 'privacy first'], hashtag: '#Privacy', priority: 1 },
    { keywords: ['data privacy', 'gdpr', 'ccpa', 'data protection', 'personal data', 'user data'], hashtag: '#DataPrivacy', priority: 1 },
    { keywords: ['data sovereignty', 'data ownership', 'own your data', 'data control', 'data rights', 'digital sovereignty', 'no tracking', 'zero tracking', 'no telemetry'], hashtag: '#DataSovereignty', priority: 1 },
    { keywords: ['security', 'secure', 'encrypted', 'encryption', 'end-to-end', 'zero knowledge', 'zero-knowledge'], hashtag: '#CyberSecurity', priority: 2 },

    // ── SaaS & B2B ────────────────────────────────────────────────────────────
    { keywords: ['saas', 'software as a service', 'subscription', 'recurring revenue', 'mrr', 'arr', 'churn', 'ltv', 'customer lifetime value'], hashtag: '#SaaS', priority: 1 },
    { keywords: ['b2b', 'business to business', 'enterprise', 'b2b saas', 'b2b software', 'b2b product', 'b2b tool', 'b2b platform', 'corporate client', 'business client'], hashtag: '#B2B', priority: 1 },
    { keywords: ['executive', 'ceo', 'cto', 'cmo', 'c-suite', 'leadership', 'management', 'decision maker', 'stakeholder'], hashtag: '#ExecutiveContent', priority: 2 },

    // ── Founder & Startup Life ────────────────────────────────────────────────
    { keywords: ['founder', 'co-founder', 'cofounder', 'building in public', 'build in public', 'buildinpublic', 'shipped', 'launched', 'side project', 'bootstrapped', 'bootstrapping'], hashtag: '#BuildInPublic', priority: 1 },
    { keywords: ['founder life', 'founder journey', 'startup life', 'startup journey', 'being a founder', 'as a founder', 'solo founder', 'indie founder'], hashtag: '#FounderLife', priority: 1 },
    { keywords: ['startup', 'start-up', 'early stage', 'seed stage', 'pre-seed', 'mvp', 'minimum viable product', 'product-market fit', 'pmf', 'go to market', 'gtm'], hashtag: '#TechStartup', priority: 1 },
    { keywords: ['indie hacker', 'indiehacker', 'indie maker', 'indie dev', 'solopreneur', 'solo developer', 'bootstrapped startup'], hashtag: '#IndieHacker', priority: 1 },

    // ── Automation & Productivity ─────────────────────────────────────────────
    { keywords: ['automat', 'workflow', 'no-code', 'nocode', 'low-code', 'lowcode', 'zapier', 'make.com', 'n8n', 'trigger', 'pipeline', 'scheduled', 'cron'], hashtag: '#Automation', priority: 1 },
    { keywords: ['no-code', 'nocode', 'no code', 'without code', 'drag and drop', 'visual builder', 'zero code'], hashtag: '#NoCode', priority: 1 },
    { keywords: ['productivity', 'productive', 'efficiency', 'time saving', 'saves time', 'streamline', 'optimize', 'workflow optimization'], hashtag: '#Productivity', priority: 2 },

    // ── Content Creation & Marketing ──────────────────────────────────────────
    { keywords: ['content creation', 'content creator', 'content strategy', 'content marketing', 'content engine', 'content calendar', 'content pipeline', 'creating content', 'produce content'], hashtag: '#ContentCreation', priority: 1 },
    { keywords: ['copywriting', 'copy', 'writing', 'ghostwriting', 'ghostwriter', 'thought leadership', 'linkedin post', 'twitter post', 'social post', 'social media'], hashtag: '#ContentCreation', priority: 2 },
    { keywords: ['marketing', 'growth', 'growth hacking', 'demand generation', 'lead generation', 'inbound', 'outbound', 'seo', 'brand'], hashtag: '#Marketing', priority: 2 },

    // ── Tech & Development ────────────────────────────────────────────────────
    { keywords: ['developer', 'development', 'programming', 'coding', 'code', 'software', 'engineer', 'engineering', 'tech stack', 'api', 'open source', 'github', 'deploy', 'deployment'], hashtag: '#TechStartup', priority: 2 },
    { keywords: ['product', 'product update', 'new feature', 'feature release', 'product launch', 'launch', 'release', 'update', 'version', 'v1', 'v2'], hashtag: '#ProductLaunch', priority: 2 },
  ];

  // Score each hashtag candidate
  const scores = {};
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        const tag = rule.hashtag;
        const score = (4 - rule.priority); // priority 1 → 3pts, priority 2 → 2pts, priority 3 → 1pt
        scores[tag] = (scores[tag] || 0) + score;
        break; // only count each rule once even if multiple keywords match
      }
    }
  }

  // Sort by score descending, then alphabetically for tie-breaking
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);

  // Always ensure at least 3 hashtags; fall back to general defaults if needed
  const defaults = ['#AI', '#TechStartup', '#BuildInPublic', '#SaaS', '#IndieHacker'];
  const combined = [...new Set([...ranked, ...defaults])];

  // Return 3–5 hashtags
  const count = Math.min(5, Math.max(3, ranked.length));
  return combined.slice(0, count);
}

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

    // Extract image URL if present
    let displayText = draft.content_text;
    let attachedImage = null;
    const imgMatch = displayText.match(/\[IMG:(https?:\/\/[^\]]+)\]$/);
    if (imgMatch) {
      attachedImage = imgMatch[1];
      displayText = displayText.replace(/\[IMG:https?:\/\/[^\]]+\]$/, '').trim();
    }

    // ── Generate hashtags and append to display text ───────────────────────────
    const hashtags = generateHashtags(displayText);
    const hashtagLine = hashtags.join(' ');
    const displayTextWithHashtags = `${displayText}\n\n${hashtagLine}`;

    // Update content_text in Supabase so approve.js picks up the hashtags
    const updatedContentText = attachedImage
      ? `${displayTextWithHashtags} [IMG:${attachedImage}]`
      : displayTextWithHashtags;

    const { error: updateError } = await supabase
      .from('content_queue')
      .update({ content_text: updatedContentText })
      .eq('id', draft.id);

    if (updateError) {
      // Non-fatal: log and continue — hashtags will still show in Telegram preview
      console.error('Failed to persist hashtags to content_queue (non-critical):', updateError);
    }
    // ──────────────────────────────────────────────────────────────────────────

    const messageText = [
      `📝 *New Draft Awaiting Approval*`,
      ``,
      `*Platform:* ${platformLabel}`,
      `*Scheduled:* ${scheduledLabel}`,
      attachedImage ? `*Image:* Attached ✓` : `*Image:* None`,
      ``,
      `---`,
      `${displayTextWithHashtags}`,
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

    // If there's an attached image, send it as a photo preview in Telegram
    if (attachedImage) {
      try {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              photo: attachedImage,
              caption: '📎 Image attached to this post'
            })
          }
        );
      } catch (photoErr) {
        console.error('Telegram photo send failed (non-critical):', photoErr);
      }
    }

    // Generate branded image and send as photo to Telegram for Instagram use
    try {
      const svg = generateBrandedSVG(displayText);
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
      platform: draft.platform,
      hashtags_added: hashtags
    });
  } catch (err) {
    console.error('Cron handler error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
