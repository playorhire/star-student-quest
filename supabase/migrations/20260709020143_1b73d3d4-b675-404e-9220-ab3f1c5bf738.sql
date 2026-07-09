
CREATE TABLE public.role_permissions (
  role public.tenant_role NOT NULL,
  feature_key TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role, feature_key)
);

GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view role_permissions"
  ON public.role_permissions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Super admins manage role_permissions"
  ON public.role_permissions FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE TRIGGER role_permissions_set_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed matrix: super_admin gets everything true; other roles per key defaults below.
WITH feats(feature_key, sa, scha, ba, teach, stud, par) AS (
  VALUES
    ('dashboard.view',           true, true, true, true, true, true),
    ('schools.manage',           true, false, false, false, false, false),
    ('branches.manage',          true, true, false, false, false, false),
    ('school_admins.manage',     true, false, false, false, false, false),
    ('branch_admins.manage',     true, true, false, false, false, false),
    ('teachers.manage',          true, true, true, false, false, false),
    ('teachers.view',            true, true, true, false, false, false),
    ('students.manage',          true, true, true, false, false, false),
    ('students.view',            true, true, true, true, false, false),
    ('parents.manage',           true, true, true, false, false, false),
    ('parents.view',             true, true, true, true, false, false),
    ('classes.manage',           true, true, true, false, false, false),
    ('classes.view',             true, true, true, true, false, false),
    ('houses.manage',            true, true, true, false, false, false),
    ('houses.view',              true, true, true, true, true, true),
    ('badges.manage',            true, true, true, false, false, false),
    ('badges.view',              true, true, true, true, true, true),
    ('rewards.manage',           true, true, true, false, false, false),
    ('rewards.view',             true, true, true, true, true, true),
    ('rewards.redeem',           true, false, false, false, true, false),
    ('point_rules.manage',       true, true, true, false, false, false),
    ('points.award',             true, false, false, true, false, false),
    ('points.view_own',          true, false, false, false, true, false),
    ('points.view_history',      true, true, true, true, true, true),
    ('qr.scan',                  true, false, false, true, false, false),
    ('qr.show',                  true, false, false, false, true, false),
    ('notifications.view',       true, true, true, true, true, true),
    ('messages.send',            true, true, true, true, false, true),
    ('messages.view',            true, true, true, true, true, true),
    ('reports.view',             true, true, true, false, false, false),
    ('settings.manage',          true, true, false, false, false, false),
    ('profile.edit',             true, true, true, true, true, true)
)
INSERT INTO public.role_permissions (role, feature_key, allowed)
SELECT r.role::public.tenant_role, f.feature_key, r.allowed
FROM feats f
CROSS JOIN LATERAL (VALUES
  ('super_admin',  f.sa),
  ('school_admin', f.scha),
  ('branch_admin', f.ba),
  ('teacher',      f.teach),
  ('student',      f.stud),
  ('parent',       f.par)
) AS r(role, allowed);
