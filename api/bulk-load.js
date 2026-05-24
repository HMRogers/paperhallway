import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verify Vercel Cron secret (Authorization: Bearer <secret>)
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { posts } = req.body;

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty "posts" array in request body' });
    }

    // Prepare data for insertion
    const insertData = posts.map(post => ({
      content_text: post.content_text,
      platform: post.platform || 'x',
      status: 'pending'
    }));

    // Insert into content_queue table
    const { data, error } = await supabase
      .from('content_queue')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database insert failed', details: error.message });
    }

    return res.status(200).json({
      message: 'Successfully inserted posts',
      count: data.length
    });
  } catch (err) {
    console.error('Bulk load handler error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
