-- Replace the legacy tenant-wide write policy. Teachers may adjust marking
-- ranges only for activities assigned to them; administrators retain their
-- existing management policy.
DROP POLICY IF EXISTS "Point rules access" ON public.point_rules;

CREATE POLICY "Point rules visible to tenant"
ON public.point_rules FOR SELECT TO authenticated
USING (
  public.is_super_admin()
  OR school_id = public.get_my_school_id_safe()
  OR branch_id = public.get_my_branch_id_safe()
);

CREATE POLICY "Teachers update assigned point rules"
ON public.point_rules FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teacher_assignments assignment
    JOIN public.teachers teacher ON teacher.id = assignment.teacher_id
    WHERE assignment.subject_id = point_rules.subject_id
      AND teacher.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teacher_assignments assignment
    JOIN public.teachers teacher ON teacher.id = assignment.teacher_id
    WHERE assignment.subject_id = point_rules.subject_id
      AND teacher.user_id = auth.uid()
  )
);
