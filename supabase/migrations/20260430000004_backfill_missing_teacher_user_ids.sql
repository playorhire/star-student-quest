-- Re-run teacher user_id backfill for databases where the earlier migration
-- was already applied before legacy-role matching was added.
--
-- Match through user_roles.email first, with auth.users.email as a fallback.
-- This covers projects where auth email and role email drifted slightly.
WITH teacher_role_matches AS (
  SELECT
    t.id AS teacher_id,
    ur.user_id AS auth_user_id
  FROM public.teachers t
  JOIN public.user_roles ur
    ON lower(ur.email) = lower(t.email)
  WHERE t.user_id IS NULL
    AND (
      ur.tenant_role = 'teacher'::public.tenant_role
      OR ur.role::text = 'teacher'
    )
  UNION
  SELECT
    t.id AS teacher_id,
    au.id AS auth_user_id
  FROM public.teachers t
  JOIN auth.users au ON lower(au.email) = lower(t.email)
  JOIN public.user_roles ur ON ur.user_id = au.id
  WHERE t.user_id IS NULL
    AND (
      ur.tenant_role = 'teacher'::public.tenant_role
      OR ur.role::text = 'teacher'
    )
),
teacher_auth_matches AS (
  SELECT
    teacher_id,
    auth_user_id,
    COUNT(*) OVER (PARTITION BY auth_user_id) AS matching_teacher_count
  FROM teacher_role_matches
  WHERE auth_user_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.teachers linked
      WHERE linked.user_id = teacher_role_matches.auth_user_id
    )
)
UPDATE public.teachers t
SET user_id = tam.auth_user_id
FROM teacher_auth_matches tam
WHERE t.id = tam.teacher_id
  AND tam.matching_teacher_count = 1;
