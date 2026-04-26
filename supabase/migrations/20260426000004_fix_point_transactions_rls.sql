-- ============================================
-- Fix point_transactions RLS / backfill tenant columns
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Ensure columns exist
ALTER TABLE public.point_transactions
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- 2. Backfill school_id from student's school_id
UPDATE public.point_transactions pt
SET school_id = s.school_id
FROM public.students s
WHERE pt.student_id = s.id
  AND pt.school_id IS NULL
  AND s.school_id IS NOT NULL;

-- 3. Backfill branch_id from student's class branch
UPDATE public.point_transactions pt
SET branch_id = c.branch_id
FROM public.students s
JOIN public.classes c ON s.class_id = c.id
WHERE pt.student_id = s.id
  AND pt.branch_id IS NULL
  AND c.branch_id IS NOT NULL;

-- 4. Allow teachers to update/delete transactions they created (legacy fallback)
-- This is a temporary fix for transactions that still have NULL school_id/branch_id
DROP POLICY IF EXISTS "Teachers own transactions" ON public.point_transactions;
CREATE POLICY "Teachers own transactions"
ON public.point_transactions FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid() AND t.id = point_transactions.teacher_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid() AND t.id = point_transactions.teacher_id
  )
);
