-- Add name column to user_roles for display
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS name TEXT;

-- Backfill with email as the default name for existing rows
UPDATE public.user_roles
SET name = COALESCE(email, 'User: ' || LEFT(user_id::text, 12))
WHERE name IS NULL;
