-- ============================================
-- Fix tenant_role for school_admin and branch_admin users
-- ============================================

-- Fix school_admin users that were incorrectly set to 'student' by the migration
UPDATE public.user_roles 
SET tenant_role = 'school_admin'::public.tenant_role
WHERE role = 'school_admin' 
  AND (tenant_role = 'student' OR tenant_role IS NULL);

-- Fix branch_admin users that were incorrectly set to 'student' by the migration
UPDATE public.user_roles 
SET tenant_role = 'branch_admin'::public.tenant_role
WHERE role = 'branch_admin' 
  AND (tenant_role = 'student' OR tenant_role IS NULL);

-- Also update the is_primary flag for school_admin and branch_admin users
UPDATE public.user_roles 
SET is_primary = true
WHERE tenant_role IN ('school_admin', 'branch_admin') 
  AND (is_primary IS NULL OR is_primary = false);
