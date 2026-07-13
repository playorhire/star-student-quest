
-- 1) Restrict "Admins can manage X" policies to authenticated role
DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;
CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage classes" ON public.classes;
CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage links" ON public.parent_student_links;
CREATE POLICY "Admins can manage links" ON public.parent_student_links
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage parents" ON public.parents;
CREATE POLICY "Admins can manage parents" ON public.parents
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage point_rules" ON public.point_rules;
CREATE POLICY "Admins can manage point_rules" ON public.point_rules
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage assignments" ON public.teacher_assignments;
CREATE POLICY "Admins can manage assignments" ON public.teacher_assignments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2) Consolidate user_roles policies: drop legacy/overlapping, keep coherent tenant-role based set
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Block self insert of roles" ON public.user_roles;
DROP POLICY IF EXISTS "Block self update of roles" ON public.user_roles;
DROP POLICY IF EXISTS "School admins manage roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;
DROP POLICY IF EXISTS "own_rows" ON public.user_roles;
DROP POLICY IF EXISTS "sa_full" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin full access on user_roles" ON public.user_roles;

-- Recreate a clean, consistent set (authenticated-only)
CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins full access" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_super_admin_safe())
  WITH CHECK (public.is_super_admin_safe());

CREATE POLICY "School admins manage roles in their school" ON public.user_roles
  FOR ALL TO authenticated
  USING (
    public.is_school_admin_safe()
    AND school_id = public.get_my_school_id_safe()
    AND tenant_role <> 'super_admin'::tenant_role
  )
  WITH CHECK (
    public.is_school_admin_safe()
    AND school_id = public.get_my_school_id_safe()
    AND tenant_role <> 'super_admin'::tenant_role
  );

-- Prevent users from ever inserting/updating their own row (defense-in-depth)
CREATE POLICY "Block self role insert" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id <> auth.uid());

CREATE POLICY "Block self role update" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (user_id <> auth.uid())
  WITH CHECK (user_id <> auth.uid());

-- 3) Restrict role_permissions reads to super admins only
DROP POLICY IF EXISTS "Authenticated can view role_permissions" ON public.role_permissions;
CREATE POLICY "Super admins can view role_permissions" ON public.role_permissions
  FOR SELECT TO authenticated
  USING (public.is_super_admin_safe());

-- 4) SECURITY DEFINER function grants: revoke anon EXECUTE broadly on public schema helpers
REVOKE EXECUTE ON FUNCTION public.is_school_admin_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_tenant_role(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_tenant_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_school_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_school_id_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_branch_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_branch_id_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_teacher_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_primary_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_linked_children() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_school() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_branch() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_school_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.belongs_to_school(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.belongs_to_branch(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_teacher() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.search_student_for_parent(text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_parents_for_branch_admin(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_notification(uuid, text, text) FROM anon, PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_student_user_id(uuid, uuid) FROM anon, PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_teacher_user_id(uuid, uuid) FROM anon, PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_student_code() FROM anon, PUBLIC, authenticated;
