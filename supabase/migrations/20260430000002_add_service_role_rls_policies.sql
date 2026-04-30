-- Add RLS policies to allow service role to update teachers and students
-- This is needed for the create-user edge function to update user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Service role can update students" ON public.students;

-- Allow service role to update teachers (for user_id assignment)
CREATE POLICY "Service role can update teachers" ON public.teachers
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to update students (for user_id assignment)
CREATE POLICY "Service role can update students" ON public.students
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);
