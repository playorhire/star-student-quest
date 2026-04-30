-- Add unique constraints to prevent duplicate teacher and student entries

-- Remove duplicate teacher records (keep oldest)
WITH teacher_duplicates AS (
  SELECT 
    email, 
    school_id,
    branch_id,
    MIN(id) as keep_id,
    array_agg(id ORDER BY created_at) as all_ids
  FROM public.teachers
  WHERE email IS NOT NULL
  GROUP BY email, school_id, branch_id
  HAVING COUNT(*) > 1
)
DELETE FROM public.teachers
WHERE id IN (
  SELECT unnest(all_ids)
  FROM teacher_duplicates
  WHERE unnest(all_ids) != keep_id
);

-- Remove duplicate student records by roll_number (keep oldest)
WITH student_duplicates AS (
  SELECT 
    roll_number, 
    school_id,
    branch_id,
    MIN(id) as keep_id,
    array_agg(id ORDER BY created_at) as all_ids
  FROM public.students
  WHERE roll_number IS NOT NULL
  GROUP BY roll_number, school_id, branch_id
  HAVING COUNT(*) > 1
)
DELETE FROM public.students
WHERE id IN (
  SELECT unnest(all_ids)
  FROM student_duplicates
  WHERE unnest(all_ids) != keep_id
);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS teachers_email_school_branch_idx;
DROP INDEX IF EXISTS students_roll_number_school_branch_idx;

-- Create unique index on teacher email per school/branch
CREATE UNIQUE INDEX teachers_email_school_branch_idx 
ON public.teachers (email, school_id, branch_id);

-- Create unique index on student roll_number per school/branch
CREATE UNIQUE INDEX students_roll_number_school_branch_idx 
ON public.students (roll_number, school_id, branch_id);
