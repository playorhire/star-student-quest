-- Fix the missing super-admin helper used by vendor and other RLS policies
CREATE OR REPLACE FUNCTION public.is_super_admin_safe()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_super_admin();
$$;

REVOKE EXECUTE ON FUNCTION public.is_super_admin_safe() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin_safe() TO authenticated;
