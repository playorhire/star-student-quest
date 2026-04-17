CREATE POLICY "Teachers can manage rewards"
ON public.rewards
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));