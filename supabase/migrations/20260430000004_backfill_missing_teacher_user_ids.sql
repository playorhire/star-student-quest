-- Re-run teacher user_id backfill for databases where the earlier migration
-- was already applied before legacy-role matching was added.
WITH teacher_auth_matches AS (
  SELECT
    t.id AS teacher_id,
    au.id AS auth_user_id,
    COUNT(*) OVER (PARTITION BY au.id) AS matching_teacher_count
  FROM public.teachers t
  JOIN auth.users au ON lower(au.email) = lower(t.email)
  JOIN public.user_roles ur
    ON ur.user_id = au.id
    AND (
      ur.tenant_role = 'teacher'::public.tenant_role
      OR ur.role::text = 'teacher'
    )
  WHERE t.user_id IS NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.teachers linked
      WHERE linked.user_id = au.id
    )
)
UPDATE public.teachers t
SET user_id = tam.auth_user_id
FROM teacher_auth_matches tam
WHERE t.id = tam.teacher_id
  AND tam.matching_teacher_count = 1;
