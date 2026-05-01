-- Allow parents to manage their own student links
CREATE POLICY "Parents can insert own links"
ON public.parent_student_links
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Parents can delete own links"
ON public.parent_student_links
FOR DELETE
TO authenticated
USING (auth.uid() = parent_user_id);

-- Function for parents to search students by exact name + roll number across all schools/branches
CREATE OR REPLACE FUNCTION public.search_student_for_parent(p_name text, p_roll text)
RETURNS TABLE(
  id uuid,
  name text,
  roll_number text,
  avatar_emoji text,
  class_name text,
  branch_name text,
  school_name text,
  already_linked boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.roll_number,
    s.avatar_emoji,
    COALESCE(c.name, '') AS class_name,
    COALESCE(b.name, '') AS branch_name,
    COALESCE(sc.name, '') AS school_name,
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      WHERE psl.student_id = s.id AND psl.parent_user_id = auth.uid()
    ) AS already_linked
  FROM public.students s
  LEFT JOIN public.classes c ON c.id = s.class_id
  LEFT JOIN public.branches b ON b.id = s.branch_id
  LEFT JOIN public.schools sc ON sc.id = s.school_id
  WHERE LOWER(TRIM(s.name)) = LOWER(TRIM(p_name))
    AND LOWER(TRIM(s.roll_number)) = LOWER(TRIM(p_roll))
  LIMIT 25;
END;
$$;

-- Function to fetch a parent's children with class/branch/school details (works regardless of branch)
CREATE OR REPLACE FUNCTION public.get_my_linked_children()
RETURNS TABLE(
  id uuid,
  name text,
  roll_number text,
  avatar_emoji text,
  total_points integer,
  class_id uuid,
  class_name text,
  branch_name text,
  school_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.roll_number,
    s.avatar_emoji,
    s.total_points,
    s.class_id,
    COALESCE(c.name, '') AS class_name,
    COALESCE(b.name, '') AS branch_name,
    COALESCE(sc.name, '') AS school_name
  FROM public.parent_student_links psl
  JOIN public.students s ON s.id = psl.student_id
  LEFT JOIN public.classes c ON c.id = s.class_id
  LEFT JOIN public.branches b ON b.id = s.branch_id
  LEFT JOIN public.schools sc ON sc.id = s.school_id
  WHERE psl.parent_user_id = auth.uid()
  ORDER BY s.name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_student_for_parent(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_linked_children() TO authenticated;