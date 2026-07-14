
-- 1. Extend tenant_role enum
ALTER TYPE public.tenant_role ADD VALUE IF NOT EXISTS 'vendor';

-- 2. Product category enum
DO $$ BEGIN
  CREATE TYPE public.product_category AS ENUM (
    'Books','Stationery','SchoolBags','WaterBottles','LunchBoxes',
    'Toys','Sports','GiftCards','Electronics','Others'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.vendor_status AS ENUM ('active','inactive','suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.product_admin_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.redemption_status AS ENUM ('pending','approved','collected','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  logo_url TEXT,
  status public.vendor_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- 4. vendor_products
CREATE TABLE IF NOT EXISTS public.vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  description TEXT,
  category public.product_category NOT NULL DEFAULT 'Others',
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  cash_price NUMERIC(10,2),
  required_points INTEGER NOT NULL CHECK (required_points >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  admin_status public.product_admin_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor ON public.vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON public.vendor_products(category);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_products TO authenticated;
GRANT ALL ON public.vendor_products TO service_role;
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

-- 5. vendor_product_schools
CREATE TABLE IF NOT EXISTS public.vendor_product_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.vendor_products(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  approved BOOLEAN NOT NULL DEFAULT true,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, school_id)
);
CREATE INDEX IF NOT EXISTS idx_vps_school ON public.vendor_product_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_vps_product ON public.vendor_product_schools(product_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_product_schools TO authenticated;
GRANT ALL ON public.vendor_product_schools TO service_role;
ALTER TABLE public.vendor_product_schools ENABLE ROW LEVEL SECURITY;

-- 6. reward_redemptions
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.vendor_products(id) ON DELETE RESTRICT,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  points_used INTEGER NOT NULL CHECK (points_used >= 0),
  status public.redemption_status NOT NULL DEFAULT 'pending',
  voucher_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  collected_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rr_student ON public.reward_redemptions(student_id);
CREATE INDEX IF NOT EXISTS idx_rr_vendor ON public.reward_redemptions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_rr_school ON public.reward_redemptions(school_id);
CREATE INDEX IF NOT EXISTS idx_rr_voucher ON public.reward_redemptions(voucher_code);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reward_redemptions TO authenticated;
GRANT ALL ON public.reward_redemptions TO service_role;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- 7. Helper functions
CREATE OR REPLACE FUNCTION public.get_my_vendor_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT id FROM public.vendors WHERE user_id = auth.uid() LIMIT 1; $$;

CREATE OR REPLACE FUNCTION public.is_vendor_safe()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.vendors WHERE user_id = auth.uid()); $$;

CREATE OR REPLACE FUNCTION public.generate_voucher_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE _code TEXT; _exists BOOLEAN;
BEGIN
  LOOP
    _code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text,'-',''),1,10));
    SELECT EXISTS(SELECT 1 FROM public.reward_redemptions WHERE voucher_code = _code) INTO _exists;
    EXIT WHEN NOT _exists;
  END LOOP;
  RETURN _code;
END; $$;

REVOKE EXECUTE ON FUNCTION public.get_my_vendor_id() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_vendor_safe() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_voucher_code() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_vendor_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_vendor_safe() TO authenticated;

-- 8. Atomic redemption RPC
CREATE OR REPLACE FUNCTION public.redeem_vendor_product(p_product_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_student RECORD; v_product RECORD; v_school_id UUID;
  v_voucher TEXT; v_id UUID; v_school_ok BOOLEAN;
BEGIN
  SELECT s.id, s.school_id, s.total_points, s.user_id, s.name
    INTO v_student FROM public.students s WHERE s.user_id = auth.uid() LIMIT 1;
  IF v_student.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Only students can redeem');
  END IF;

  SELECT * INTO v_product FROM public.vendor_products WHERE id = p_product_id FOR UPDATE;
  IF v_product.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Product not found');
  END IF;
  IF NOT v_product.is_active OR v_product.admin_status <> 'approved' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Product unavailable');
  END IF;
  IF v_product.stock_quantity <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Out of stock');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.vendor_product_schools
    WHERE product_id = p_product_id AND school_id = v_student.school_id AND approved
  ) INTO v_school_ok;
  IF NOT v_school_ok THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not available at your school');
  END IF;

  IF v_student.total_points < v_product.required_points THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not enough points');
  END IF;

  v_voucher := public.generate_voucher_code();

  INSERT INTO public.reward_redemptions
    (student_id, product_id, vendor_id, school_id, points_used, voucher_code, status)
  VALUES (v_student.id, p_product_id, v_product.vendor_id, v_student.school_id,
          v_product.required_points, v_voucher, 'approved')
  RETURNING id INTO v_id;

  UPDATE public.students SET total_points = total_points - v_product.required_points
    WHERE id = v_student.id;
  UPDATE public.vendor_products SET stock_quantity = stock_quantity - 1
    WHERE id = p_product_id;

  -- Notify student and vendor
  PERFORM public.create_notification(v_student.user_id,
    '🎁 Reward approved!', 'Your voucher: ' || v_voucher);
  PERFORM public.create_notification(
    (SELECT user_id FROM public.vendors WHERE id = v_product.vendor_id),
    '📦 New redemption', v_student.name || ' redeemed ' || v_product.product_name);

  RETURN jsonb_build_object('success', true, 'redemption_id', v_id, 'voucher', v_voucher);
END; $$;

REVOKE EXECUTE ON FUNCTION public.redeem_vendor_product(UUID) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_vendor_product(UUID) TO authenticated;

-- 9. Collect voucher RPC (vendor scans / enters)
CREATE OR REPLACE FUNCTION public.collect_voucher(p_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_r RECORD; v_vendor_id UUID; v_student_user UUID;
BEGIN
  v_vendor_id := public.get_my_vendor_id();
  IF v_vendor_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Vendor only');
  END IF;
  SELECT * INTO v_r FROM public.reward_redemptions
    WHERE voucher_code = p_code FOR UPDATE;
  IF v_r.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid voucher');
  END IF;
  IF v_r.vendor_id <> v_vendor_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not your voucher');
  END IF;
  IF v_r.status = 'collected' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already collected');
  END IF;
  IF v_r.status = 'cancelled' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cancelled');
  END IF;
  IF v_r.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Voucher expired');
  END IF;

  UPDATE public.reward_redemptions
    SET status = 'collected', collected_at = now()
    WHERE id = v_r.id;

  SELECT user_id INTO v_student_user FROM public.students WHERE id = v_r.student_id;
  PERFORM public.create_notification(v_student_user,
    '✅ Reward collected!', 'Voucher ' || p_code || ' has been redeemed');

  RETURN jsonb_build_object('success', true, 'redemption_id', v_r.id);
END; $$;

REVOKE EXECUTE ON FUNCTION public.collect_voucher(TEXT) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.collect_voucher(TEXT) TO authenticated;

-- 10. RLS policies
-- vendors
CREATE POLICY "vendors_super_admin_all" ON public.vendors FOR ALL TO authenticated
  USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());
CREATE POLICY "vendors_self_read" ON public.vendors FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "vendors_self_update" ON public.vendors FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- vendor_products
CREATE POLICY "vp_super_admin_all" ON public.vendor_products FOR ALL TO authenticated
  USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());
CREATE POLICY "vp_vendor_own" ON public.vendor_products FOR ALL TO authenticated
  USING (vendor_id = public.get_my_vendor_id())
  WITH CHECK (vendor_id = public.get_my_vendor_id());
CREATE POLICY "vp_school_users_read" ON public.vendor_products FOR SELECT TO authenticated
  USING (
    admin_status = 'approved' AND is_active = true AND EXISTS (
      SELECT 1 FROM public.vendor_product_schools vps
      WHERE vps.product_id = vendor_products.id
        AND vps.approved
        AND vps.school_id = public.get_my_school_id_safe()
    )
  );

-- vendor_product_schools
CREATE POLICY "vps_super_admin_all" ON public.vendor_product_schools FOR ALL TO authenticated
  USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());
CREATE POLICY "vps_vendor_read" ON public.vendor_product_schools FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.vendor_products vp
    WHERE vp.id = product_id AND vp.vendor_id = public.get_my_vendor_id()
  ));
CREATE POLICY "vps_school_read" ON public.vendor_product_schools FOR SELECT TO authenticated
  USING (school_id = public.get_my_school_id_safe());

-- reward_redemptions
CREATE POLICY "rr_super_admin_all" ON public.reward_redemptions FOR ALL TO authenticated
  USING (public.is_super_admin_safe()) WITH CHECK (public.is_super_admin_safe());
CREATE POLICY "rr_student_own" ON public.reward_redemptions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = reward_redemptions.student_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "rr_vendor_own" ON public.reward_redemptions FOR SELECT TO authenticated
  USING (vendor_id = public.get_my_vendor_id());
CREATE POLICY "rr_vendor_update" ON public.reward_redemptions FOR UPDATE TO authenticated
  USING (vendor_id = public.get_my_vendor_id())
  WITH CHECK (vendor_id = public.get_my_vendor_id());
CREATE POLICY "rr_school_admin_read" ON public.reward_redemptions FOR SELECT TO authenticated
  USING (school_id = public.get_my_school_id_safe() AND public.is_school_admin_safe());

-- 11. updated_at triggers
CREATE TRIGGER trg_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_vendor_products_updated_at BEFORE UPDATE ON public.vendor_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
