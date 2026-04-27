-- Comprehensive RLS fix for multi-tenant role hierarchy
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Helper functions (SECURITY DEFINER to bypass RLS)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_teacher_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.teachers WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_school_id_safe()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.user_roles WHERE user_id = auth.uid() AND is_primary = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_branch_id_safe()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT branch_id FROM public.user_roles WHERE user_id = auth.uid() AND is_primary = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND tenant_role = 'super_admin' AND is_primary = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_my_teacher_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_school_id_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_branch_id_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ============================================
-- 2. Point transactions - fix teacher insert 403
-- ============================================
ALTER TABLE public.point_transactions
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

UPDATE public.point_transactions pt
SET school_id = s.school_id
FROM public.students s
WHERE pt.student_id = s.id AND pt.school_id IS NULL AND s.school_id IS NOT NULL;

UPDATE public.point_transactions pt
SET branch_id = c.branch_id
FROM public.students s
JOIN public.classes c ON s.class_id = c.id
WHERE pt.student_id = s.id AND pt.branch_id IS NULL AND c.branch_id IS NOT NULL;

-- Drop all conflicting policies
DROP POLICY IF EXISTS "Teachers own transactions" ON public.point_transactions;
DROP POLICY IF EXISTS "Point transactions tenant access" ON public.point_transactions;
DROP POLICY IF EXISTS "Teachers can insert own point transactions" ON public.point_transactions;
DROP POLICY IF EXISTS "Teachers can update own point transactions" ON public.point_transactions;
DROP POLICY IF EXISTS "Teachers can delete own point transactions" ON public.point_transactions;

-- Single comprehensive policy
CREATE POLICY "Point transactions access"
ON public.point_transactions FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR teacher_id = public.get_my_teacher_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR teacher_id = public.get_my_teacher_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 3. Badges - fix missing WITH CHECK for school admin inserts
-- ============================================
DROP POLICY IF EXISTS "Badges tenant access" ON public.badges;
CREATE POLICY "Badges access"
ON public.badges FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
);

-- ============================================
-- 4. Rewards - fix missing WITH CHECK
-- ============================================
DROP POLICY IF EXISTS "Rewards tenant access" ON public.rewards;
CREATE POLICY "Rewards access"
ON public.rewards FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 5. Subjects - fix missing WITH CHECK
-- ============================================
DROP POLICY IF EXISTS "Subjects tenant access" ON public.subjects;
CREATE POLICY "Subjects access"
ON public.subjects FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 6. Classes - fix missing WITH CHECK
-- ============================================
DROP POLICY IF EXISTS "Classes tenant access" ON public.classes;
CREATE POLICY "Classes access"
ON public.classes FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 7. Teacher assignments - fix missing WITH CHECK
-- ============================================
DROP POLICY IF EXISTS "Teacher assignments tenant access" ON public.teacher_assignments;
CREATE POLICY "Teacher assignments access"
ON public.teacher_assignments FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 8. Point rules - fix missing WITH CHECK
-- ============================================
DROP POLICY IF EXISTS "Point rules tenant access" ON public.point_rules;
CREATE POLICY "Point rules access"
ON public.point_rules FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

-- ============================================
-- 9. Students - ensure WITH CHECK exists
-- ============================================
DROP POLICY IF EXISTS "Students tenant access" ON public.students;
CREATE POLICY "Students access"
ON public.students FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR user_id = auth.uid()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR user_id = auth.uid()
);

-- ============================================
-- 10. Teachers - ensure WITH CHECK exists
-- ============================================
DROP POLICY IF EXISTS "Teachers tenant access" ON public.teachers;
CREATE POLICY "Teachers access"
ON public.teachers FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR user_id = auth.uid()
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR user_id = auth.uid()
);

-- ============================================
-- 11. Schools
-- ============================================
DROP POLICY IF EXISTS "Super admin full access on schools" ON public.schools;
CREATE POLICY "Super admin full access on schools"
ON public.schools FOR ALL TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "School admin sees own school" ON public.schools;
CREATE POLICY "School admin sees own school"
ON public.schools FOR SELECT TO authenticated
USING (public.get_my_school_id_safe() IS NOT NULL AND id = public.get_my_school_id_safe());

-- ============================================
-- 12. Branches
-- ============================================
DROP POLICY IF EXISTS "Super admin full access on branches" ON public.branches;
CREATE POLICY "Super admin full access on branches"
ON public.branches FOR ALL TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "School admin branch access" ON public.branches;
CREATE POLICY "School admin branch access"
ON public.branches FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

DROP POLICY IF EXISTS "Branch admin sees own branch" ON public.branches;
CREATE POLICY "Branch admin sees own branch"
ON public.branches FOR SELECT TO authenticated
USING (id = public.get_my_branch_id_safe());

-- ============================================
-- 13. user_roles
-- ============================================
DROP POLICY IF EXISTS "Super admin full access on user_roles" ON public.user_roles;
CREATE POLICY "Super admin full access on user_roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;
CREATE POLICY "Users see own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- School admin can manage user_roles in their school (branch admins, teachers, students)
DROP POLICY IF EXISTS "user_roles_sa" ON public.user_roles;
CREATE POLICY "user_roles_sa"
ON public.user_roles FOR ALL TO authenticated
USING (
  public.get_my_school_id_safe() IS NOT NULL
  AND school_id = public.get_my_school_id_safe()
)
WITH CHECK (
  public.get_my_school_id_safe() IS NOT NULL
  AND school_id = public.get_my_school_id_safe()
);

-- ============================================
-- 14. Redemptions
-- ============================================
DROP POLICY IF EXISTS "Redemptions tenant access" ON public.redemptions;
CREATE POLICY "Redemptions access"
ON public.redemptions FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
