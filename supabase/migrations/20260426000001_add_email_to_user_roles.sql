-- Add email column to user_roles for easier display
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing rows where email is null by pulling from auth.users
-- Note: This won't work for all rows if auth.users emails aren't accessible,
-- but new inserts will populate email going forward.
UPDATE public.user_roles
SET email = auth.users.email
FROM auth.users
WHERE public.user_roles.user_id = auth.users.id
  AND public.user_roles.email IS NULL;
