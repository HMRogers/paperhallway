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

// ─── Upload media to X (Twitter) via v1.1 media upload ─────────────────────────

async function uploadMediaToX(imageUrl) {
  // Download the image
  const imgResponse = await fetch(imageUrl);
  if (!imgResponse.ok) throw new Error(`Failed to download image: ${imgResponse.status}`);
  const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
  const base64Image = imgBuffer.toString('base64');

  // Upload to X media endpoint (v1.1)
  const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
  const method = 'POST';

  // Build form data
  const boundary = '----FormBoundary' + crypto.randomBytes(8).toString('hex');
  const formBody = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="media_data"',
    '',
    base64Image,
    `--${boundary}--`
  ].join('\r\n');

  const authHeader = buildOAuthHeader(
    method,
    uploadUrl,
    process.env.X_CONSUMER_KEY,
    process.env.X_CONSUMER_SECRET,
    process.env.X_ACCESS_TOKEN,
    process.env.X_ACCESS_TOKEN_SECRET
  );

  const response = await fetch(uploadUrl, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: formBody
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`X Media Upload error (${response.status}): ${JSON.stringify(result)}`);
  }

  return result.media_id_string;
}

// ─── Post to X (Twitter) via API v2 ────────────────────────────────────────────

async function postToX(text, imageUrl) {
  // If there's an image, upload it first
  let mediaId = null;
  if (imageUrl) {
    try {
      mediaId = await uploadMediaToX(imageUrl);
    } catch (err) {
      console.error('Media upload failed, posting text-only:', err.message);
    }
  }

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

  const body = { text };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
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

// ─── Generate Branded Image for Instagram ──────────────────────────────────────

async function generateBrandedImage(text) {
  // Create an SVG with the post text on a branded background
  // Then convert to a hosted image URL using a public SVG-to-PNG service
  
  // Truncate text for image (Instagram images shouldn't have too much text)
  const displayText = text.length > 280 ? text.substring(0, 277) + '...' : text;
  
  // Split text into lines (max ~40 chars per line for readability)
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

  // Build SVG text elements
  const lineHeight = 38;
  const startY = 540 - (lines.length * lineHeight) / 2;
  const textElements = lines
    .map((line, i) => {
      const escapedLine = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `<text x="540" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#3d3929">${escapedLine}</text>`;
    })
    .join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
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

  // Encode SVG as data URI and use a conversion service
  const svgBase64 = Buffer.from(svg).toString('base64');
  const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`;
  
  // Use the SVG directly as the image URL for Instagram
  // Instagram requires a publicly accessible image URL, so we'll upload to Supabase Storage
  const fileName = `instagram-${Date.now()}.svg`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('instagram-images')
    .upload(fileName, Buffer.from(svg), {
      contentType: 'image/svg+xml',
      upsert: true
    });

  if (uploadError) {
    // Fallback: try PNG generation via external service
    console.error('Storage upload failed:', uploadError);
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('instagram-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ─── Post to Instagram via Graph API ────────────────────────────────────────────

async function postToInstagram(text, imageUrl) {
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!igUserId || !accessToken) {
    throw new Error('Instagram credentials not configured (INSTAGRAM_USER_ID, INSTAGRAM_ACCESS_TOKEN)');
  }

  // Step 1: Create a media container
  const createUrl = `https://graph.facebook.com/v19.0/${igUserId}/media`;
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: text,
      access_token: accessToken
    })
  });

  const createResult = await createResponse.json();
  if (!createResponse.ok || !createResult.id) {
    throw new Error(`Instagram create media error: ${JSON.stringify(createResult)}`);
  }

  // Step 2: Publish the container
  const publishUrl = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: createResult.id,
      access_token: accessToken
    })
  });

  const publishResult = await publishResponse.json();
  if (!publishResponse.ok || !publishResult.id) {
    throw new Error(`Instagram publish error: ${JSON.stringify(publishResult)}`);
  }

  return { success: true, id: publishResult.id };
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
      const results = { x: null, linkedin: null, instagram: null };
      const errors = [];

      // Determine which platforms to post to
      const platforms = item.platform === 'all'
        ? ['x', 'linkedin', 'instagram']
        : item.platform === 'both'
          ? ['x', 'linkedin']
          : item.platform === 'x+instagram'
            ? ['x', 'instagram']
            : [item.platform];

      // Extract image URL if present (format: [IMG:url] at end of content_text)
      let postText = item.content_text;
      let imageUrl = null;
      const imgMatch = postText.match(/\[IMG:(https?:\/\/[^\]]+)\]$/);
      if (imgMatch) {
        imageUrl = imgMatch[1];
        postText = postText.replace(/\[IMG:https?:\/\/[^\]]+\]$/, '').trim();
      }

      // Post to X
      if (platforms.includes('x')) {
        try {
          results.x = await postToX(postText, imageUrl);
        } catch (err) {
          errors.push(`X: ${err.message}`);
        }
      }

      // Post to LinkedIn
      if (platforms.includes('linkedin')) {
        try {
          results.linkedin = await postToLinkedIn(postText);
        } catch (err) {
          errors.push(`LinkedIn: ${err.message}`);
        }
      }

      // Instagram: generate branded image and send via Telegram for manual posting
      if (platforms.includes('instagram')) {
        try {
          const igImageUrl = await generateBrandedImage(postText);
          results.instagram = { manual: true, imageUrl: igImageUrl };
          // Send image link to Telegram for manual Instagram posting
          await sendTelegramConfirmation(
            `🖼️ *Instagram Image Ready*\n\nBranded image: ${igImageUrl}\n\n_Caption:_ ${postText.substring(0, 200)}${postText.length > 200 ? '...' : ''}\n\n_Save and post to Instagram manually._`
          );
        } catch (err) {
          errors.push(`Instagram image: ${err.message}`);
        }
      }

      // If all platforms failed, don't mark as published
      if (errors.length === platforms.length) {
        await sendTelegramConfirmation(
          `⚠️ *Publishing Failed*\n\nDraft: "${item.content_text.substring(0, 80)}..."\n\nErrors:\n${errors.join('\n')}`
        );
        return res.status(500).send(htmlResponse(
          'Publishing Failed',
          `Could not publish. Errors: ${errors.join('; ')}`,
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
      if (results.instagram) successPlatforms.push('Instagram (image sent)');

      let telegramMsg = `✅ *Published Successfully*\n\n`;
      telegramMsg += `*Platforms:* ${successPlatforms.join(', ')}\n`;
      telegramMsg += `*Content:* "${item.content_text.substring(0, 100)}${item.content_text.length > 100 ? '...' : ''}"`;
      if (errors.length > 0) {
        telegramMsg += `\n\n⚠️ Partial failures:\n${errors.join('\n')}`;
      }

      await sendTelegramConfirmation(telegramMsg);

      const displayMsg = errors.length > 0
        ? `Published to ${successPlatforms.join(', ')}. Some platforms had errors: ${errors.join('; ')}`
        : `Successfully published to ${successPlatforms.join(', ')}.`;

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
