CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.vendor_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.vendor_applications TO authenticated;
CREATE POLICY vendor_application_public_submit ON public.vendor_applications
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY vendor_application_super_admin_read ON public.vendor_applications
  FOR SELECT TO authenticated USING (public.is_super_admin_safe());
CREATE POLICY vendor_application_super_admin_update ON public.vendor_applications
  FOR UPDATE TO authenticated USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());

CREATE TABLE IF NOT EXISTS public.vendor_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vendor_id, school_id)
);
ALTER TABLE public.vendor_schools ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.vendor_schools TO authenticated;
CREATE POLICY vendor_schools_super_admin_all ON public.vendor_schools
  FOR ALL TO authenticated USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());
CREATE POLICY vendor_schools_vendor_read ON public.vendor_schools
  FOR SELECT TO authenticated USING (vendor_id = public.get_my_vendor_id());
