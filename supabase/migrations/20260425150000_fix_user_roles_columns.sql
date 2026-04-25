-- ============================================
-- EMERGENCY FIX: Add tenant columns to user_roles
-- Run this in Supabase SQL Editor immediately
-- ============================================

-- 1. Create tenant_role enum (safe if already exists)
DO $$ BEGIN
  CREATE TYPE public.tenant_role AS ENUM (
    'super_admin', 'school_admin', 'branch_admin', 
    'teacher', 'student', 'parent'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add missing columns to user_roles (safe if already exist)
ALTER TABLE public.user_roles 
  ADD COLUMN IF NOT EXISTS tenant_role public.tenant_role,
  ADD COLUMN IF NOT EXISTS school_id UUID,
  ADD COLUMN IF NOT EXISTS branch_id UUID,
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT true;

-- 3. Migrate existing legacy roles to tenant_role
UPDATE public.user_roles 
  SET tenant_role = CASE role
    WHEN 'admin' THEN 'super_admin'::public.tenant_role
    WHEN 'teacher' THEN 'teacher'::public.tenant_role
    WHEN 'student' THEN 'student'::public.tenant_role
    WHEN 'parent' THEN 'parent'::public.tenant_role
    ELSE 'student'::public.tenant_role
  END
WHERE tenant_role IS NULL;

-- 4. Fix any remaining nulls
UPDATE public.user_roles SET tenant_role = 'student' WHERE tenant_role IS NULL;
UPDATE public.user_roles SET is_primary = true WHERE is_primary IS NULL;

-- 5. Enable RLS on user_roles (if not already)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Drop old policies and recreate them properly
DROP POLICY IF EXISTS "Super admin full access on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;

-- Super admin can do everything
CREATE POLICY "Super admin full access on user_roles"
ON public.user_roles FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND tenant_role = 'super_admin' 
    AND is_primary = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND tenant_role = 'super_admin' 
    AND is_primary = true
  )
);

-- Everyone can see their own role rows
CREATE POLICY "Users see own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 7. Verify results
SELECT 
  tenant_role, 
  role AS legacy_role, 
  COUNT(*) AS count,
  COUNT(school_id) AS with_school,
  COUNT(branch_id) AS with_branch
FROM public.user_roles 
GROUP BY tenant_role, role
ORDER BY count DESC;
