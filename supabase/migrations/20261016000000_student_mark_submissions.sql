CREATE TABLE IF NOT EXISTS public.student_mark_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  result_type text NOT NULL CHECK (result_type IN ('Quiz', 'Test', 'Mark sheet')),
  marks_entered integer NOT NULL CHECK (marks_entered >= 0),
  evidence_path text NOT NULL,
  ocr_text text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_note text,
  point_transaction_id uuid REFERENCES public.point_transactions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE public.student_mark_submissions ENABLE ROW LEVEL SECURITY;

-- Keep the existing document quotas, while allowing a dedicated evidence path
-- for mark approval uploads (the database submission RPC validates the path).
CREATE OR REPLACE FUNCTION public.student_document_upload_allowed(object_name text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE student_uuid uuid; file_name text; prefix text; period_start timestamptz; doc_type text; subject_uuid uuid; upload_count integer;
BEGIN
  student_uuid := (storage.foldername(object_name))[1]::uuid;
  file_name := storage.filename(object_name);
  IF (storage.foldername(object_name))[2] = 'mark-submissions' THEN
    RETURN EXISTS (SELECT 1 FROM public.students st WHERE st.id = student_uuid AND st.user_id = auth.uid());
  END IF;
  doc_type := split_part(file_name, '-', 1);
  IF doc_type IN ('quiz', 'test') THEN
    subject_uuid := split_part(file_name, '-', 2)::uuid;
    IF NOT EXISTS (SELECT 1 FROM public.students st JOIN public.subjects su ON su.class_id = st.class_id WHERE st.id = student_uuid AND st.user_id = auth.uid() AND su.id = subject_uuid) THEN RETURN false; END IF;
    prefix := doc_type || '-' || subject_uuid::text || '--';
    IF doc_type = 'quiz' THEN period_start := date_trunc('week', now()); ELSE period_start := date_trunc('month', now()); END IF;
  ELSIF doc_type = 'certificate' THEN prefix := 'certificate-'; period_start := date_trunc('month', now());
  ELSIF doc_type = 'mark' AND split_part(file_name, '-', 2) = 'sheet' THEN prefix := 'mark-sheet-'; period_start := now() - interval '3 months';
  ELSE RETURN false;
  END IF;
  SELECT count(*) INTO upload_count FROM storage.objects o WHERE o.bucket_id = 'student-documents' AND (storage.foldername(o.name))[1] = student_uuid::text AND storage.filename(o.name) LIKE prefix || '%' AND o.created_at >= period_start;
  RETURN upload_count < 1;
EXCEPTION WHEN invalid_text_representation THEN RETURN false;
END;
$$;

CREATE POLICY "Students and authorized staff can view mark submissions"
ON public.student_mark_submissions FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid())
  OR public.is_super_admin()
  OR EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id AND ta.subject_id = student_mark_submissions.subject_id
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE s.id = student_mark_submissions.student_id AND t.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Assigned staff can view submitted mark evidence" ON storage.objects;
CREATE POLICY "Assigned staff can view submitted mark evidence"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.student_mark_submissions sms
      JOIN public.students s ON s.id = sms.student_id
      JOIN public.teacher_assignments ta ON ta.class_id = s.class_id AND ta.subject_id = sms.subject_id
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE sms.evidence_path = storage.objects.name AND t.user_id = auth.uid()
    )
  )
);

CREATE OR REPLACE FUNCTION public.submit_student_mark(
  p_subject_id uuid,
  p_result_type text,
  p_marks_entered integer,
  p_evidence_path text,
  p_ocr_text text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_student public.students%ROWTYPE; v_rule public.point_rules%ROWTYPE; v_id uuid;
BEGIN
  SELECT * INTO v_student FROM public.students WHERE user_id = auth.uid();
  IF v_student.id IS NULL THEN RAISE EXCEPTION 'Student profile not found'; END IF;
  IF p_result_type NOT IN ('Quiz', 'Test', 'Mark sheet') THEN RAISE EXCEPTION 'Invalid result type'; END IF;
  IF p_evidence_path NOT LIKE v_student.id::text || '/mark-submissions/%' THEN RAISE EXCEPTION 'Invalid evidence path'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.subjects WHERE id = p_subject_id AND class_id = v_student.class_id) THEN
    RAISE EXCEPTION 'Subject is not assigned to your class';
  END IF;
  SELECT * INTO v_rule FROM public.point_rules WHERE subject_id = p_subject_id;
  IF v_rule.id IS NULL OR p_marks_entered < v_rule.min_marks OR p_marks_entered > v_rule.max_marks THEN
    RAISE EXCEPTION 'Marks are outside the configured range';
  END IF;
  INSERT INTO public.student_mark_submissions(student_id, subject_id, result_type, marks_entered, evidence_path, ocr_text)
  VALUES (v_student.id, p_subject_id, p_result_type, p_marks_entered, p_evidence_path, p_ocr_text) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

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
    v_points := GREATEST(0, floor((v_sub.marks_entered - v_rule.passing_marks) * v_rule.multiplier)::integer);
    INSERT INTO public.point_transactions(student_id, teacher_id, subject_id, marks_entered, passing_marks, multiplier, points_awarded, school_id, branch_id)
    VALUES (v_student.id, v_teacher_id, v_sub.subject_id, v_sub.marks_entered, v_rule.passing_marks, v_rule.multiplier, v_points, v_student.school_id, v_student.branch_id)
    RETURNING id INTO v_sub.point_transaction_id;
    UPDATE public.student_mark_submissions SET point_transaction_id = v_sub.point_transaction_id WHERE id = p_submission_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_student_mark(uuid, text, integer, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_student_mark(uuid, text, integer, text, text) TO authenticated;
REVOKE ALL ON FUNCTION public.review_student_mark(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_student_mark(uuid, text, text) TO authenticated;
