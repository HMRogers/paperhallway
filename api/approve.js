import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── OAuth 1.0a Signing for X (Twitter) API ────────────────────────────────────

function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams)
  ].join('&');

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  return crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');
}

function buildOAuthHeader(method, url, consumerKey, consumerSecret, accessToken, accessTokenSecret) {
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0'
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    consumerSecret,
    accessTokenSecret
  );

  oauthParams.oauth_signature = signature;

  const headerString = Object.keys(oauthParams)
    .sort()
    .map((key) => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`)
    .join(', ');

  return `OAuth ${headerString}`;
}

// ─── Post to X (Twitter) via API v2 ────────────────────────────────────────────

async function postToX(text) {
  const url = 'https://api.x.com/2/tweets';
  const method = 'POST';

  const authHeader = buildOAuthHeader(
    method,
    url,
    process.env.X_CONSUMER_KEY,
    process.env.X_CONSUMER_SECRET,
    process.env.X_ACCESS_TOKEN,
    process.env.X_ACCESS_TOKEN_SECRET
  );

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`X API error (${response.status}): ${JSON.stringify(result)}`);
  }

  return result;
}

// ─── Post to LinkedIn via REST API v2 ───────────────────────────────────────────

async function postToLinkedIn(text) {
  const url = 'https://api.linkedin.com/rest/posts';

  const body = {
    author: process.env.LINKEDIN_PERSON_ID,
    commentary: text,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401'
    },
    body: JSON.stringify(body)
  });

  if (response.status === 201 || response.status === 200) {
    const locationHeader = response.headers.get('x-restli-id') || response.headers.get('location');
    return { success: true, id: locationHeader };
  }

  const result = await response.text();
  throw new Error(`LinkedIn API error (${response.status}): ${result}`);
}

// ─── Send Telegram Confirmation ─────────────────────────────────────────────────

async function sendTelegramConfirmation(message) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    }
  );
}

// ─── HTML Response Templates ────────────────────────────────────────────────────

function htmlResponse(title, message, isSuccess) {
  const color = isSuccess ? '#10b981' : '#ef4444';
  const icon = isSuccess ? '✅' : '❌';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; }
    .card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    .icon { font-size: 3rem; margin-bottom: 1rem; }
    h1 { color: ${color}; margin: 0 0 0.5rem; font-size: 1.5rem; }
    p { color: #6b7280; margin: 0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}

// ─── Main Handler ───────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const { token, action } = req.query;

  // Validate parameters
  if (!token || !action) {
    return res.status(400).send(htmlResponse('Bad Request', 'Missing token or action parameter.', false));
  }

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).send(htmlResponse('Bad Request', 'Action must be "approve" or "reject".', false));
  }

  try {
    // Look up the content by approval_token
    const { data: item, error: lookupError } = await supabase
      .from('content_queue')
      .select('*')
      .eq('approval_token', token)
      .single();

    if (lookupError || !item) {
      return res.status(404).send(htmlResponse('Not Found', 'This approval link is invalid or has already been used.', false));
    }

    // Check if already processed
    if (item.status !== 'pending') {
      return res.status(409).send(htmlResponse(
        'Already Processed',
        `This draft was already ${item.status}. No further action needed.`,
        false
      ));
    }

    // ─── APPROVE ──────────────────────────────────────────────────────────────────
    if (action === 'approve') {
      const results = { x: null, linkedin: null };
      const errors = [];

      // Post to X
      if (item.platform === 'x' || item.platform === 'both') {
        try {
          results.x = await postToX(item.content_text);
        } catch (err) {
          errors.push(`X: ${err.message}`);
        }
      }

      // Post to LinkedIn
      if (item.platform === 'linkedin' || item.platform === 'both') {
        try {
          results.linkedin = await postToLinkedIn(item.content_text);
        } catch (err) {
          errors.push(`LinkedIn: ${err.message}`);
        }
      }

      // If all platforms failed, don't mark as published
      const platformCount = item.platform === 'both' ? 2 : 1;
      if (errors.length === platformCount) {
        await sendTelegramConfirmation(
          `⚠️ *Publishing Failed*\n\nDraft: "${item.content_text.substring(0, 80)}..."\n\nErrors:\n${errors.join('\n')}`
        );
        return res.status(500).send(htmlResponse(
          'Publishing Failed',
          `Could not publish to ${item.platform}. Errors: ${errors.join('; ')}`,
          false
        ));
      }

      // Update status to published
      const { error: updateError } = await supabase
        .from('content_queue')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (updateError) {
        console.error('Failed to update status:', updateError);
      }

      // Build confirmation message
      const successPlatforms = [];
      if (results.x) successPlatforms.push('X (Twitter)');
      if (results.linkedin) successPlatforms.push('LinkedIn');

      let telegramMsg = `✅ *Published Successfully*\n\n`;
      telegramMsg += `*Platforms:* ${successPlatforms.join(', ')}\n`;
      telegramMsg += `*Content:* "${item.content_text.substring(0, 100)}${item.content_text.length > 100 ? '...' : ''}"`;
      if (errors.length > 0) {
        telegramMsg += `\n\n⚠️ Partial failures:\n${errors.join('\n')}`;
      }

      await sendTelegramConfirmation(telegramMsg);

      const displayMsg = errors.length > 0
        ? `Published to ${successPlatforms.join(', ')}. Some platforms had errors: ${errors.join('; ')}`
        : `Successfully published to ${successPlatforms.join(' and ')}.`;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(htmlResponse('Published!', displayMsg, true));
    }

    // ─── REJECT ───────────────────────────────────────────────────────────────────
    if (action === 'reject') {
      const { error: updateError } = await supabase
        .from('content_queue')
        .update({ status: 'rejected' })
        .eq('id', item.id);

      if (updateError) {
        console.error('Failed to update status:', updateError);
      }

      await sendTelegramConfirmation(
        `❌ *Draft Rejected*\n\nContent: "${item.content_text.substring(0, 100)}${item.content_text.length > 100 ? '...' : ''}"`
      );

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(htmlResponse('Rejected', 'The draft has been rejected and will not be published.', false));
    }
  } catch (err) {
    console.error('Approval handler error:', err);
    return res.status(500).send(htmlResponse('Server Error', 'An unexpected error occurred. Please try again.', false));
  }
}
