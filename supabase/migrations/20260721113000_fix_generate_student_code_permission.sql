-- generate_student_code() is called by the set_student_code trigger on INSERT into students.
-- It must be executable by any authenticated user who can insert students (admins, teachers).
-- Revoking EXECUTE from authenticated broke student creation for admin users.
GRANT EXECUTE ON FUNCTION public.generate_student_code() TO authenticated;