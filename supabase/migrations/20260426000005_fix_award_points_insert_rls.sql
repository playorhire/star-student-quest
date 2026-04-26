-- ============================================
-- Fix teacher award-points insert permissions
-- ============================================
-- The teacher "Award Points" screen inserts into public.point_transactions.
-- After the multi-tenant RLS migration, inserts can be rejected with 403 if
-- branch_id is missing or if only tenant-wide policies are present. This adds
-- explicit teacher-owned INSERT/UPDATE/DELETE policies while keeping tenant
-- isolation for reads/admin access.

ALTER TABLE public.point_transactions
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- Keep existing rows usable by tenant policies.
UPDATE public.point_transactions pt
SET school_id = COALESCE(pt.school_id, s.school_id),
    branch_id = COALESCE(pt.branch_id, s.branch_id, c.branch_id)
FROM public.students s
LEFT JOIN public.classes c ON c.id = s.class_id
WHERE pt.student_id = s.id
  AND (pt.school_id IS NULL OR pt.branch_id IS NULL);

-- Make sure future inserts that omit tenant columns are still populated server-side.
CREATE OR REPLACE FUNCTION public.set_point_transaction_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SELECT COALESCE(NEW.school_id, s.school_id),
         COALESCE(NEW.branch_id, s.branch_id, c.branch_id)
  INTO NEW.school_id, NEW.branch_id
  FROM public.students s
  LEFT JOIN public.classes c ON c.id = s.class_id
  WHERE s.id = NEW.student_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_point_transaction_tenant ON public.point_transactions;
CREATE TRIGGER trg_set_point_transaction_tenant
BEFORE INSERT OR UPDATE OF student_id, school_id, branch_id ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.set_point_transaction_tenant();

DROP POLICY IF EXISTS "Teachers can insert own point transactions" ON public.point_transactions;
CREATE POLICY "Teachers can insert own point transactions"
ON public.point_transactions
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teachers t
    WHERE t.user_id = auth.uid()
      AND t.id = point_transactions.teacher_id
  )
  AND EXISTS (
    SELECT 1
    FROM public.students s
    WHERE s.id = point_transactions.student_id
      AND (
        public.is_super_admin()
        OR s.school_id = public.get_my_school_id()
        OR s.branch_id = public.get_my_branch_id()
        OR s.class_id IN (
          SELECT ta.class_id
          FROM public.teacher_assignments ta
          WHERE ta.teacher_id = point_transactions.teacher_id
        )
      )
  )
);

DROP POLICY IF EXISTS "Teachers can update own point transactions" ON public.point_transactions;
CREATE POLICY "Teachers can update own point transactions"
ON public.point_transactions
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teachers t
    WHERE t.user_id = auth.uid()
      AND t.id = point_transactions.teacher_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teachers t
    WHERE t.user_id = auth.uid()
      AND t.id = point_transactions.teacher_id
  )
);

DROP POLICY IF EXISTS "Teachers can delete own point transactions" ON public.point_transactions;
CREATE POLICY "Teachers can delete own point transactions"
ON public.point_transactions
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teachers t
    WHERE t.user_id = auth.uid()
      AND t.id = point_transactions.teacher_id
  )
);

-- The broad tenant FOR ALL policy from 20260425000000 had USING but no explicit
-- WITH CHECK in some environments. Recreate it explicitly so tenant inserts are
-- accepted when school_id/branch_id are present.
DROP POLICY IF EXISTS "Point transactions tenant access" ON public.point_transactions;
CREATE POLICY "Point transactions tenant access"
ON public.point_transactions FOR ALL TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id()
  OR branch_id = public.get_my_branch_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
  public.is_super_admin()
  OR school_id = public.get_my_school_id()
  OR branch_id = public.get_my_branch_id()
  OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);