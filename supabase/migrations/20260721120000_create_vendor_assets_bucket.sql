-- Create the vendor-assets bucket for product images
-- The bucket was referenced by RLS policies in a previous migration
-- but was never actually created, causing "Bucket not found" errors on upload.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-assets',
  'vendor-assets',
  false,
  5242880, -- 5 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']::text[]
)
ON CONFLICT (id) DO NOTHING;