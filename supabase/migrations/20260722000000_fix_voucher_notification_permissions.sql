-- Create the notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create the create_notification function if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_notification(_user_id uuid, _title text, _body text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, title, body, read)
  VALUES (_user_id, _title, _body, false);
END; $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_notification(uuid, text, text) TO authenticated;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications (using DO block for conditional creation)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'users_read_own_notifications') THEN
    CREATE POLICY "users_read_own_notifications" ON public.notifications
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'service_role_all_notifications') THEN
    CREATE POLICY "service_role_all_notifications" ON public.notifications
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Also fix the redeem_vendor_product function to use plain text notification
-- titles to avoid any encoding issues with emoji characters in SQL literals.
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

  -- Notify student and vendor (using plain text, no emoji in SQL literals)
  PERFORM public.create_notification(v_student.user_id,
    'Reward approved!', 'Your voucher: ' || v_voucher);
  PERFORM public.create_notification(
    (SELECT user_id FROM public.vendors WHERE id = v_product.vendor_id),
    'New redemption', v_student.name || ' redeemed ' || v_product.product_name);

  RETURN jsonb_build_object('success', true, 'redemption_id', v_id, 'voucher', v_voucher);
END; $$;

REVOKE EXECUTE ON FUNCTION public.redeem_vendor_product(UUID) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_vendor_product(UUID) TO authenticated;