-- Add branch admin access to parents and parent_student_links

-- Allow branch admins to manage parents in their branch
DROP POLICY IF EXISTS "Branch admins can manage parents" ON public.parents;
CREATE POLICY "Branch admins can manage parents" ON public.parents
FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'branch_admin'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'branch_admin'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
);

-- Allow branch admins to manage parent_student_links for students in their branch
DROP POLICY IF EXISTS "Branch admins can manage parent_student_links" ON public.parent_student_links;
CREATE POLICY "Branch admins can manage parent_student_links" ON public.parent_student_links
FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'branch_admin'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id 
    AND s.branch_id = (
      SELECT branch_id FROM public.user_roles ur2 
      WHERE ur2.user_id = auth.uid() 
      AND ur2.tenant_role = 'branch_admin'
      LIMIT 1
    )
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'branch_admin'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id 
    AND s.branch_id = (
      SELECT branch_id FROM public.user_roles ur2 
      WHERE ur2.user_id = auth.uid() 
      AND ur2.tenant_role = 'branch_admin'
      LIMIT 1
    )
  )
);
