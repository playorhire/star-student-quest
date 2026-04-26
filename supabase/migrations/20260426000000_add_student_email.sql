-- Add email column to students for credential management
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Also add user_id reference display support (already exists in schema)
-- This migration ensures students can have email for admin credential management
