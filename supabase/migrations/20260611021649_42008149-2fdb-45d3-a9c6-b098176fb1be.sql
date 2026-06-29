
CREATE POLICY "Public read property images" ON storage.objects FOR SELECT USING (bucket_id = 'properties');
CREATE POLICY "Admins upload property images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'properties' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update property images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'properties' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete property images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'properties' AND public.has_role(auth.uid(), 'admin'));
