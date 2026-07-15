
-- Helper: does the given product have an approved assignment for my school?
CREATE OR REPLACE FUNCTION public.product_available_at_my_school(_product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vendor_product_schools vps
    WHERE vps.product_id = _product_id
      AND vps.approved
      AND vps.school_id = public.get_my_school_id_safe()
  );
$$;

-- Helper: does the given product belong to my vendor?
CREATE OR REPLACE FUNCTION public.product_belongs_to_my_vendor(_product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vendor_products vp
    WHERE vp.id = _product_id
      AND vp.vendor_id = public.get_my_vendor_id()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.product_available_at_my_school(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.product_belongs_to_my_vendor(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.product_available_at_my_school(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.product_belongs_to_my_vendor(uuid) TO authenticated;

-- Replace recursive policies
DROP POLICY IF EXISTS vp_school_users_read ON public.vendor_products;
CREATE POLICY vp_school_users_read ON public.vendor_products
  FOR SELECT TO authenticated
  USING (
    admin_status = 'approved'::product_admin_status
    AND is_active = true
    AND public.product_available_at_my_school(id)
  );

DROP POLICY IF EXISTS vps_vendor_read ON public.vendor_product_schools;
CREATE POLICY vps_vendor_read ON public.vendor_product_schools
  FOR SELECT TO authenticated
  USING (public.product_belongs_to_my_vendor(product_id));
