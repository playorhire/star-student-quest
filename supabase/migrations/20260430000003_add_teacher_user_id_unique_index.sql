-- Backfill existing teacher rows that were created before create-user linked user_id.
-- Only update unambiguous matches: one teacher row per teacher-role auth user email.
WITH teacher_auth_matches AS (
  SELECT
    t.id AS teacher_id,
    au.id AS auth_user_id,
    COUNT(*) OVER (PARTITION BY au.id) AS matching_teacher_count
  FROM public.teachers t
  JOIN auth.users au ON lower(au.email) = lower(t.email)
  JOIN public.user_roles ur
    ON ur.user_id = au.id
    AND ur.tenant_role = 'teacher'::public.tenant_role
  WHERE t.user_id IS NULL
)
UPDATE public.teachers t
SET user_id = tam.auth_user_id
FROM teacher_auth_matches tam
WHERE t.id = tam.teacher_id
  AND tam.matching_teacher_count = 1;

-- Prevent one auth user from being linked to multiple teacher records.
CREATE UNIQUE INDEX IF NOT EXISTS teachers_user_id_unique_idx
ON public.teachers (user_id)
WHERE user_id IS NOT NULL;
