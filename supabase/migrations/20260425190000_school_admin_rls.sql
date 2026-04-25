-- ============================================
-- RLS policies for school admin CRUD
-- Run this in Supabase SQL Editor
-- ============================================

-- Ensure helper exists
CREATE OR REPLACE FUNCTION public.get_my_school_id_safe()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.user_roles
  WHERE user_id = auth.uid() AND is_primary = true
  LIMIT 1;
$$;

-- Schools: school admin can only SELECT their own school
DROP POLICY IF EXISTS "schools_sa_select" ON public.schools;
CREATE POLICY "schools_sa_select"
ON public.schools FOR SELECT TO authenticated
USING (id = public.get_my_school_id_safe());

-- Branches: school admin can manage branches in their school
DROP POLICY IF EXISTS "branches_sa" ON public.branches;
CREATE POLICY "branches_sa"
ON public.branches FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

-- Teachers: school admin can manage teachers in their school
DROP POLICY IF EXISTS "teachers_sa" ON public.teachers;
CREATE POLICY "teachers_sa"
ON public.teachers FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

-- Students: school admin can manage students in their school
DROP POLICY IF EXISTS "students_sa" ON public.students;
CREATE POLICY "students_sa"
ON public.students FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

-- Rewards: school admin can manage rewards in their school
DROP POLICY IF EXISTS "rewards_sa" ON public.rewards;
CREATE POLICY "rewards_sa"
ON public.rewards FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

-- Classes: school admin can manage classes in their school
DROP POLICY IF EXISTS "classes_sa" ON public.classes;
CREATE POLICY "classes_sa"
ON public.classes FOR ALL TO authenticated
USING (school_id = public.get_my_school_id_safe())
WITH CHECK (school_id = public.get_my_school_id_safe());

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_school_id_safe() TO authenticated;
