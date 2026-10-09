-- Private documents uploaded by students.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Students can view their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.students WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Students can upload their own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.students WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Students can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.students WHERE user_id = auth.uid()
  )
);
