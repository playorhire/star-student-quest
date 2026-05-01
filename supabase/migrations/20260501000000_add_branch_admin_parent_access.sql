-- Add branch admin access to parents and parent_student_links

-- Helper function to get branch admin's branch ID
CREATE OR REPLACE FUNCTION public.get_my_branch_id_safe()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT branch_id FROM public.user_roles
  WHERE user_id = auth.uid() AND tenant_role = 'branch_admin' AND is_primary = true
  LIMIT 1;
$$;

-- Allow branch admins to manage parents in their branch
-- Since parents don't have branch_id, we allow branch admins to manage all parents
-- but they can only create links to students in their branch
DROP POLICY IF EXISTS "Branch admins can manage parents" ON public.parents;
CREATE POLICY "Branch admins can manage parents" ON public.parents
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- Additional policy specifically for parent creation by branch admins
DROP POLICY IF EXISTS "Branch admins can insert parents" ON public.parents;
CREATE POLICY "Branch admins can insert parents" ON public.parents
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.tenant_role = 'branch_admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- Allow branch admins to manage parent_student_links for students in their branch
DROP POLICY IF EXISTS "Branch admins can manage parent_student_links" ON public.parent_student_links;
CREATE POLICY "Branch admins can manage parent_student_links" ON public.parent_student_links
FOR ALL TO authenticated
USING (
  (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.tenant_role = 'branch_admin'
    )
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id 
      AND s.branch_id = public.get_my_branch_id_safe()
    )
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.tenant_role = 'branch_admin'
    )
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id 
      AND s.branch_id = public.get_my_branch_id_safe()
    )
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- Additional policy specifically for parent_student_links insertion by branch admins
DROP POLICY IF EXISTS "Branch admins can insert parent_student_links" ON public.parent_student_links;
CREATE POLICY "Branch admins can insert parent_student_links" ON public.parent_student_links
FOR INSERT TO authenticated
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.tenant_role = 'branch_admin'
    )
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id 
      AND s.branch_id = public.get_my_branch_id_safe()
    )
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);
