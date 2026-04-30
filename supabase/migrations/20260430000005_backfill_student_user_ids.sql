-- Backfill existing student rows that were created before create-user linked user_id.
-- Match through user_roles.email first, with auth.users.email as a fallback.
WITH student_role_matches AS (
  SELECT
    s.id AS student_id,
    ur.user_id AS auth_user_id
  FROM public.students s
  JOIN public.user_roles ur
    ON lower(ur.email) = lower(s.email)
  WHERE s.user_id IS NULL
    AND s.email IS NOT NULL
    AND (
      ur.tenant_role = 'student'::public.tenant_role
      OR ur.role::text = 'student'
    )
  UNION
  SELECT
    s.id AS student_id,
    au.id AS auth_user_id
  FROM public.students s
  JOIN auth.users au ON lower(au.email) = lower(s.email)
  JOIN public.user_roles ur ON ur.user_id = au.id
  WHERE s.user_id IS NULL
    AND s.email IS NOT NULL
    AND (
      ur.tenant_role = 'student'::public.tenant_role
      OR ur.role::text = 'student'
    )
),
student_auth_matches AS (
  SELECT
    student_id,
    auth_user_id,
    COUNT(*) OVER (PARTITION BY auth_user_id) AS matching_student_count
  FROM student_role_matches
  WHERE auth_user_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.students linked
      WHERE linked.user_id = student_role_matches.auth_user_id
    )
)
UPDATE public.students s
SET user_id = sam.auth_user_id
FROM student_auth_matches sam
WHERE s.id = sam.student_id
  AND sam.matching_student_count = 1;

-- Prevent one auth user from being linked to multiple student records.
CREATE UNIQUE INDEX IF NOT EXISTS students_user_id_unique_idx
ON public.students (user_id)
WHERE user_id IS NOT NULL;
