-- Migration: Create content_queue table for social media distribution engine
-- Run this in Supabase SQL Editor or via supabase db push

CREATE TABLE IF NOT EXISTS content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_text TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'instagram', 'both', 'x+instagram', 'all')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected')),
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  approval_token TEXT UNIQUE DEFAULT gen_random_uuid()::text
);

-- Enable Row Level Security
ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Allow full access for service role (used by serverless functions)
CREATE POLICY "Service role has full access"
  ON content_queue
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for efficient querying of pending items by schedule
CREATE INDEX idx_content_queue_pending_scheduled
  ON content_queue (scheduled_for ASC)
  WHERE status = 'pending';

-- Index for token lookups
CREATE INDEX idx_content_queue_approval_token
  ON content_queue (approval_token);

-- Create storage bucket for Instagram images (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('instagram-images', 'instagram-images', true);
