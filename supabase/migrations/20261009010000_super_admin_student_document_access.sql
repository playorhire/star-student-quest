-- Let super admins list and create signed URLs for files in the private
-- student-documents bucket. This grants read access only; students retain
-- ownership of upload and delete operations.
DROP POLICY IF EXISTS "Super admins can view student documents" ON storage.objects;
CREATE POLICY "Super admins can view student documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'student-documents'
  AND public.is_super_admin_safe()
);
