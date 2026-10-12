CREATE OR REPLACE FUNCTION public.student_document_upload_allowed(object_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  student_uuid uuid;
  file_name text;
  prefix text;
  period_start timestamptz;
  doc_type text;
  subject_uuid uuid;
  upload_count integer;
BEGIN
  student_uuid := (storage.foldername(object_name))[1]::uuid;
  file_name := storage.filename(object_name);
  doc_type := split_part(file_name, '-', 1);

  IF doc_type IN ('quiz', 'test') THEN
    subject_uuid := substring(file_name from '^[^-]+-([0-9a-f-]{36})--')::uuid;
    IF subject_uuid IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.students st
      JOIN public.subjects su ON su.class_id = st.class_id
      WHERE st.id = student_uuid AND st.user_id = auth.uid() AND su.id = subject_uuid
    ) THEN
      RETURN false;
    END IF;
    prefix := doc_type || '-' || subject_uuid::text || '--';
    IF doc_type = 'quiz' THEN
      period_start := date_trunc('week', now());
    ELSE
      period_start := date_trunc('month', now());
    END IF;
  ELSIF doc_type = 'certificate' THEN
    prefix := 'certificate-';
    period_start := date_trunc('month', now());
  ELSIF doc_type = 'mark' AND split_part(file_name, '-', 2) = 'sheet' THEN
    prefix := 'mark-sheet-';
    period_start := now() - interval '3 months';
  ELSE
    RETURN false;
  END IF;

  SELECT count(*) INTO upload_count
  FROM storage.objects o
  WHERE o.bucket_id = 'student-documents'
    AND (storage.foldername(o.name))[1] = student_uuid::text
    AND storage.filename(o.name) LIKE prefix || '%'
    AND o.created_at >= period_start;

  RETURN upload_count < 1;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN false;
END;
$$;
