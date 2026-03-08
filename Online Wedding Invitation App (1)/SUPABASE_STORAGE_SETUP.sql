-- Supabase Storage Bucket Setup
-- Run this in your Supabase SQL Editor to set up storage buckets

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('wedding-images', 'wedding-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access (read)
DROP POLICY IF EXISTS "Public Access for wedding images" ON storage.objects;
CREATE POLICY "Public Access for wedding images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-images');

-- Allow public uploads (admin is password-protected)
DROP POLICY IF EXISTS "Public Upload for wedding images" ON storage.objects;
CREATE POLICY "Public Upload for wedding images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'wedding-images');

-- Allow public updates
DROP POLICY IF EXISTS "Public Update for wedding images" ON storage.objects;
CREATE POLICY "Public Update for wedding images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'wedding-images');

-- Allow public delete (admin can delete images)
DROP POLICY IF EXISTS "Public Delete for wedding images" ON storage.objects;
CREATE POLICY "Public Delete for wedding images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'wedding-images');

-- Optional: Set file size limits (50MB default is fine for images)
-- You can adjust in Supabase Dashboard > Storage > Settings