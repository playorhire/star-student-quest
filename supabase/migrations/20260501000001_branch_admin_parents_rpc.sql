-- Create RPC function for branch admin to access parents
CREATE OR REPLACE FUNCTION public.get_parents_for_branch_admin(p_branch_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ,
  linked_students JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the caller is a branch admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND tenant_role = 'branch_admin'
    AND is_primary = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Branch admin required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.email,
    p.phone,
    p.created_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'student_id', psl.student_id,
          'students', jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'roll_number', s.roll_number,
            'classes', jsonb_build_object('name', c.name)
          )
        )
      ) FILTER (WHERE s.id IS NOT NULL),
      '[]'::jsonb
    ) as linked_students
  FROM public.parents p
  LEFT JOIN public.parent_student_links psl ON psl.parent_user_id = p.user_id
  LEFT JOIN public.students s ON s.id = psl.student_id AND s.branch_id = p_branch_id
  LEFT JOIN public.classes c ON c.id = s.class_id
  GROUP BY p.id, p.user_id, p.name, p.email, p.phone, p.created_at
  ORDER BY p.name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_parents_for_branch_admin TO authenticated;
