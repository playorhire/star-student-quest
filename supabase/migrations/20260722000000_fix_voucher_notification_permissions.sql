-- Fix: Re-grant EXECUTE on create_notification so SECURITY DEFINER functions
-- that call it from authenticated context work properly.
-- The function was incorrectly revoked from authenticated in a prior migration.
GRANT EXECUTE ON FUNCTION public.create_notification(uuid, text, text) TO authenticated;

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