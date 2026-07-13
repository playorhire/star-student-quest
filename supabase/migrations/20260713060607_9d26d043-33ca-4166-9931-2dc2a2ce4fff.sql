
-- Fix infinite recursion in user_roles RLS by removing self-referencing EXISTS subqueries
-- and using security-definer helper functions instead.

CREATE OR REPLACE FUNCTION public.is_school_admin_safe()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND is_primary = true
      AND tenant_role IN ('super_admin'::tenant_role, 'school_admin'::tenant_role)
  );
$$;

DROP POLICY IF EXISTS "School admins manage roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Block self insert of roles" ON public.user_roles;
DROP POLICY IF EXISTS "Block self update of roles" ON public.user_roles;

CREATE POLICY "School admins manage roles in their school"
ON public.user_roles
FOR ALL
USING (school_id = get_my_school_id_safe() AND public.is_school_admin_safe())
WITH CHECK (school_id = get_my_school_id_safe() AND public.is_school_admin_safe());

CREATE POLICY "Block self insert of roles"
ON public.user_roles
FOR INSERT
WITH CHECK (is_super_admin_safe() OR public.is_school_admin_safe());

CREATE POLICY "Block self update of roles"
ON public.user_roles
FOR UPDATE
USING (is_super_admin_safe() OR public.is_school_admin_safe())
WITH CHECK (is_super_admin_safe() OR public.is_school_admin_safe());
