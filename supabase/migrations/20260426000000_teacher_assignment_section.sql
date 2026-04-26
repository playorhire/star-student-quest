-- ============================================
-- Add section to teacher_assignments + school-admin RLS
-- ============================================

-- 1. Add section column to teacher_assignments (if not exists)
ALTER TABLE public.teacher_assignments
  ADD COLUMN IF NOT EXISTS section TEXT;

-- 2. Ensure school_id and branch_id exist on teacher_assignments
ALTER TABLE public.teacher_assignments
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- 3. Ensure teachers table has branch_id (should already exist from multi_tenant_schema)
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- 4. Ensure avatar_emoji exists on teachers
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS avatar_emoji TEXT DEFAULT '👨‍🏫';

-- 5. Update teacher_assignments tenant columns from referenced tables on insert
CREATE OR REPLACE FUNCTION public.set_teacher_assignment_tenant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set school_id from teacher
  IF NEW.school_id IS NULL THEN
    SELECT school_id INTO NEW.school_id FROM public.teachers WHERE id = NEW.teacher_id;
  END IF;
  -- Set branch_id from teacher
  IF NEW.branch_id IS NULL THEN
    SELECT branch_id INTO NEW.branch_id FROM public.teachers WHERE id = NEW.teacher_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_teacher_assignment_tenant ON public.teacher_assignments;
CREATE TRIGGER trg_set_teacher_assignment_tenant
  BEFORE INSERT ON public.teacher_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_teacher_assignment_tenant();

-- 6. RLS for teacher_assignments: school admin can manage assignments in their school
DROP POLICY IF EXISTS "Teacher assignments school admin access" ON public.teacher_assignments;
CREATE POLICY "Teacher assignments school admin access"
ON public.teacher_assignments FOR ALL TO authenticated
USING (
  school_id = public.get_my_school_id_safe()
  OR EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = teacher_assignments.teacher_id
    AND t.school_id = public.get_my_school_id_safe()
  )
)
WITH CHECK (
  school_id = public.get_my_school_id_safe()
  OR EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = teacher_assignments.teacher_id
    AND t.school_id = public.get_my_school_id_safe()
  )
);

-- 7. Branch admin can manage assignments for teachers in their branch
DROP POLICY IF EXISTS "Teacher assignments branch admin access" ON public.teacher_assignments;
CREATE POLICY "Teacher assignments branch admin access"
ON public.teacher_assignments FOR ALL TO authenticated
USING (
  branch_id = public.get_my_branch_id()
  OR EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = teacher_assignments.teacher_id
    AND t.branch_id = public.get_my_branch_id()
  )
)
WITH CHECK (
  branch_id = public.get_my_branch_id()
  OR EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = teacher_assignments.teacher_id
    AND t.branch_id = public.get_my_branch_id()
  )
);
