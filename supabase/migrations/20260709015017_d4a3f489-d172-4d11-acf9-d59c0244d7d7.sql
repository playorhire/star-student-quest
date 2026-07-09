
-- 1. Drop overly permissive SELECT policies
DROP POLICY IF EXISTS "Authenticated can view parents" ON public.parents;
DROP POLICY IF EXISTS "Anyone authenticated can view classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated can view point_rules" ON public.point_rules;
DROP POLICY IF EXISTS "Authenticated can view assignments" ON public.teacher_assignments;
DROP POLICY IF EXISTS "Anyone authenticated can view badges" ON public.badges;

-- Add tenant-scoped SELECT for parents (admins, linked parents, same-school staff)
CREATE POLICY "Parents visible to admins linked parents and same-school staff"
ON public.parents FOR SELECT TO authenticated
USING (
  public.is_super_admin()
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('school_admin'::public.tenant_role, 'branch_admin'::public.tenant_role, 'teacher'::public.tenant_role)
  )
);

-- Badges: same-school (or super admin)
CREATE POLICY "Badges viewable within school"
ON public.badges FOR SELECT TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
);

-- 2. user_roles: replace overly broad tenant policy with admin-only variant
DROP POLICY IF EXISTS "user_roles_sa" ON public.user_roles;

CREATE POLICY "School admins manage roles in their school"
ON public.user_roles FOR ALL TO authenticated
USING (
  school_id = public.get_my_school_id_safe()
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('super_admin'::public.tenant_role, 'school_admin'::public.tenant_role)
  )
)
WITH CHECK (
  school_id = public.get_my_school_id_safe()
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('super_admin'::public.tenant_role, 'school_admin'::public.tenant_role)
  )
);

-- 3. Prevent privilege escalation: no user-scoped INSERT/UPDATE on user_roles.
-- Only admin/super_admin policies (already present) can write.
-- Add explicit restrictive policy blocking non-admin writes as a defense-in-depth.
CREATE POLICY "Block self insert of roles"
ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (
  public.is_super_admin()
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('super_admin'::public.tenant_role, 'school_admin'::public.tenant_role)
  )
);

CREATE POLICY "Block self update of roles"
ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated
USING (
  public.is_super_admin()
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('super_admin'::public.tenant_role, 'school_admin'::public.tenant_role)
  )
)
WITH CHECK (
  public.is_super_admin()
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_primary = true
      AND ur.tenant_role IN ('super_admin'::public.tenant_role, 'school_admin'::public.tenant_role)
  )
);

-- 4. Revoke EXECUTE from anon (and PUBLIC) on all SECURITY DEFINER functions in public.
-- Revoke authenticated EXECUTE from trigger-only helpers.
REVOKE EXECUTE ON FUNCTION public.belongs_to_branch(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.belongs_to_school(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_school_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_branch_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_branch_id_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_primary_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_school_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_school_id_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_teacher_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_tenant_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_parents_for_branch_admin(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_branch() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_school() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_tenant_role(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_teacher() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid, integer) FROM anon, PUBLIC;

-- Trigger-only functions: not intended to be called via API. Revoke from anon + authenticated.
REVOKE EXECUTE ON FUNCTION public.notify_parents_on_points() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_student_on_points() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recompute_house_on_student_move() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_point_transaction_tenant() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_teacher_assignment_tenant() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_user_roles_from_profiles() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_user_roles_role_columns() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_house_points_on_tx() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_student_points() FROM anon, authenticated, PUBLIC;

-- Admin-only user_id fixups: not intended to be callable by any client role.
REVOKE EXECUTE ON FUNCTION public.update_student_user_id(uuid, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_teacher_user_id(uuid, uuid) FROM anon, authenticated, PUBLIC;
