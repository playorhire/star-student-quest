-- ============================================
-- MULTI-TENANT SCHEMA MIGRATION
-- ============================================

-- 1. Create tenant_role enum
DO $$ BEGIN
  CREATE TYPE public.tenant_role AS ENUM ('super_admin', 'school_admin', 'branch_admin', 'teacher', 'student', 'parent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Schools table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- 3. Branches table
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- 4. Extend user_roles with tenant columns
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS tenant_role public.tenant_role,
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT true;

-- Migrate existing roles to tenant_role
UPDATE public.user_roles SET tenant_role = 'super_admin' WHERE role = 'admin';
UPDATE public.user_roles SET tenant_role = 'teacher' WHERE role = 'teacher';
UPDATE public.user_roles SET tenant_role = 'student' WHERE role = 'student';
UPDATE public.user_roles SET tenant_role = 'parent' WHERE role = 'parent';

-- 5. Add school_id / branch_id to existing tables
ALTER TABLE public.students      ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.students      ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.teachers      ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.teachers      ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.rewards       ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.rewards       ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.classes       ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.classes       ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.subjects      ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.subjects      ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.point_rules   ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.point_rules   ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.point_transactions ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.point_transactions ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.redemptions   ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.redemptions   ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.badges        ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.teacher_assignments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.teacher_assignments ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_my_tenant_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT tenant_role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid() AND is_primary = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_school_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT school_id
  FROM public.user_roles
  WHERE user_id = auth.uid() AND is_primary = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_branch_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT branch_id
  FROM public.user_roles
  WHERE user_id = auth.uid() AND is_primary = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_tenant_role(_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND tenant_role = _role::public.tenant_role AND is_primary = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT has_tenant_role('super_admin');
$$;

CREATE OR REPLACE FUNCTION public.belongs_to_school(_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND school_id = _school_id AND is_primary = true
  );
$$;

CREATE OR REPLACE FUNCTION public.belongs_to_branch(_branch_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$  
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND branch_id = _branch_id AND is_primary = true
  );
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Schools: super_admin full access, school_admin sees own school
DROP POLICY IF EXISTS "Super admin full access on schools" ON public.schools;
CREATE POLICY "Super admin full access on schools"
ON public.schools FOR ALL TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "School admin sees own school" ON public.schools;
CREATE POLICY "School admin sees own school"
ON public.schools FOR SELECT TO authenticated
USING (belongs_to_school(id));

-- Branches: super_admin all, school_admin their school's branches, branch_admin their branch
DROP POLICY IF EXISTS "Super admin full access on branches" ON public.branches;
CREATE POLICY "Super admin full access on branches"
ON public.branches FOR ALL TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "School admin branch access" ON public.branches;
CREATE POLICY "School admin branch access"
ON public.branches FOR ALL TO authenticated
USING (school_id IN (SELECT school_id FROM public.user_roles WHERE user_id = auth.uid() AND is_primary = true))
WITH CHECK (school_id IN (SELECT school_id FROM public.user_roles WHERE user_id = auth.uid() AND is_primary = true));

DROP POLICY IF EXISTS "Branch admin sees own branch" ON public.branches;
CREATE POLICY "Branch admin sees own branch"
ON public.branches FOR SELECT TO authenticated
USING (id IN (SELECT branch_id FROM public.user_roles WHERE user_id = auth.uid() AND is_primary = true));

-- user_roles: super_admin full access, users see own roles
DROP POLICY IF EXISTS "Super admin full access on user_roles" ON public.user_roles;
CREATE POLICY "Super admin full access on user_roles"
ON public.user_roles FOR ALL TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;
CREATE POLICY "Users see own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Students: tenant isolation
DROP POLICY IF EXISTS "Students tenant access" ON public.students;
CREATE POLICY "Students tenant access"
ON public.students FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
  OR user_id = auth.uid()
);

-- Teachers: tenant isolation  
DROP POLICY IF EXISTS "Teachers tenant access" ON public.teachers;
CREATE POLICY "Teachers tenant access"
ON public.teachers FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
  OR user_id = auth.uid()
);

-- Rewards: tenant isolation
DROP POLICY IF EXISTS "Rewards tenant access" ON public.rewards;
CREATE POLICY "Rewards tenant access"
ON public.rewards FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
);

-- Classes: tenant isolation
DROP POLICY IF EXISTS "Classes tenant access" ON public.classes;
CREATE POLICY "Classes tenant access"
ON public.classes FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
);

-- Subjects: tenant isolation
DROP POLICY IF EXISTS "Subjects tenant access" ON public.subjects;
CREATE POLICY "Subjects tenant access"
ON public.subjects FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
);

-- Point transactions: tenant isolation
DROP POLICY IF EXISTS "Point transactions tenant access" ON public.point_transactions;
CREATE POLICY "Point transactions tenant access"
ON public.point_transactions FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Redemptions: tenant isolation
DROP POLICY IF EXISTS "Redemptions tenant access" ON public.redemptions;
CREATE POLICY "Redemptions tenant access"
ON public.redemptions FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Badges: tenant isolation
DROP POLICY IF EXISTS "Badges tenant access" ON public.badges;
CREATE POLICY "Badges tenant access"
ON public.badges FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
);

-- Teacher assignments: tenant isolation
DROP POLICY IF EXISTS "Teacher assignments tenant access" ON public.teacher_assignments;
CREATE POLICY "Teacher assignments tenant access"
ON public.teacher_assignments FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
);

-- Point rules: tenant isolation
DROP POLICY IF EXISTS "Point rules tenant access" ON public.point_rules;
CREATE POLICY "Point rules tenant access"
ON public.point_rules FOR ALL TO authenticated
USING (
  is_super_admin()
  OR school_id = get_my_school_id()
  OR branch_id = get_my_branch_id()
);
