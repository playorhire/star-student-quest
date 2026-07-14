
CREATE POLICY "vendor_assets_read_authenticated" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'vendor-assets');
CREATE POLICY "vendor_assets_write_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vendor-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "vendor_assets_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'vendor-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "vendor_assets_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'vendor-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
