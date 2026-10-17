-- Quiz points now match the marks earned; passing marks and multipliers no
-- longer affect point awards from student mark submissions.
CREATE OR REPLACE FUNCTION public.review_student_mark(p_submission_id uuid, p_decision text, p_note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_sub public.student_mark_submissions%ROWTYPE; v_student public.students%ROWTYPE;
  v_rule public.point_rules%ROWTYPE; v_teacher_id uuid; v_points integer;
BEGIN
  IF p_decision NOT IN ('approved', 'rejected') THEN RAISE EXCEPTION 'Invalid decision'; END IF;
  SELECT * INTO v_sub FROM public.student_mark_submissions WHERE id = p_submission_id FOR UPDATE;
  IF v_sub.id IS NULL OR v_sub.status <> 'pending' THEN RAISE EXCEPTION 'Submission is no longer pending'; END IF;
  SELECT * INTO v_student FROM public.students WHERE id = v_sub.student_id;
  IF NOT public.is_super_admin() THEN
    SELECT t.id INTO v_teacher_id FROM public.teachers t
    JOIN public.teacher_assignments ta ON ta.teacher_id = t.id
    WHERE t.user_id = auth.uid() AND ta.class_id = v_student.class_id AND ta.subject_id = v_sub.subject_id LIMIT 1;
    IF v_teacher_id IS NULL THEN RAISE EXCEPTION 'Not authorized to review this submission'; END IF;
  END IF;
  UPDATE public.student_mark_submissions SET status = p_decision, reviewer_id = auth.uid(), review_note = p_note, reviewed_at = now()
  WHERE id = p_submission_id;
  IF p_decision = 'approved' THEN
    SELECT * INTO v_rule FROM public.point_rules WHERE subject_id = v_sub.subject_id;
    IF v_rule.id IS NULL OR v_sub.marks_entered < v_rule.min_marks OR v_sub.marks_entered > v_rule.max_marks THEN
      RAISE EXCEPTION 'Current marking rule does not allow this score';
    END IF;
    v_points := GREATEST(0, v_sub.marks_entered);
    INSERT INTO public.point_transactions(student_id, teacher_id, subject_id, marks_entered, passing_marks, multiplier, points_awarded, school_id, branch_id)
    VALUES (v_student.id, v_teacher_id, v_sub.subject_id, v_sub.marks_entered, 0, 1, v_points, v_student.school_id, v_student.branch_id)
    RETURNING id INTO v_sub.point_transaction_id;
    UPDATE public.student_mark_submissions SET point_transaction_id = v_sub.point_transaction_id WHERE id = p_submission_id;
  END IF;
END;
$$;
