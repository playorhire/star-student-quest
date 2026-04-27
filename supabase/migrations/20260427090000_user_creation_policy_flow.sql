-- Support the requested user-creation hierarchy and explicit school/branch location fields.

ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT;

CREATE OR REPLACE FUNCTION public.get_my_primary_role()
RETURNS public.tenant_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    tenant_role,
    CASE role
      WHEN 'admin' THEN 'super_admin'::public.tenant_role
      WHEN 'teacher' THEN 'teacher'::public.tenant_role
      WHEN 'student' THEN 'student'::public.tenant_role
      WHEN 'parent' THEN 'parent'::public.tenant_role
      ELSE 'student'::public.tenant_role
    END
  )
  FROM public.user_roles
  WHERE user_id = auth.uid() AND is_primary = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_primary_role() TO authenticated;
