-- Create atomic redemption function
-- This bypasses RLS by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION redeem_reward(
  p_student_id UUID,
  p_reward_id UUID,
  p_points_spent INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_points INTEGER;
  v_reward_stock INTEGER;
  v_reward_cost INTEGER;
  v_redemption_id UUID;
  v_result JSONB;
BEGIN
  -- Lock student row and get current points
  SELECT total_points INTO v_student_points
  FROM students
  WHERE id = p_student_id
  FOR UPDATE;

  -- Check student exists
  IF v_student_points IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Student not found'
    );
  END IF;

  -- Lock reward row and get current stock and cost
  SELECT stock, point_cost INTO v_reward_stock, v_reward_cost
  FROM rewards
  WHERE id = p_reward_id
  FOR UPDATE;

  -- Check reward exists
  IF v_reward_stock IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Reward not found'
    );
  END IF;

  -- Validate points match
  IF v_reward_cost != p_points_spent THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Point cost mismatch'
    );
  END IF;

  -- Check sufficient points
  IF v_student_points < p_points_spent THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Insufficient points'
    );
  END IF;

  -- Check stock available
  IF v_reward_stock <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Reward out of stock'
    );
  END IF;

  -- Insert redemption record
  INSERT INTO redemptions (student_id, reward_id, points_spent, status)
  VALUES (p_student_id, p_reward_id, p_points_spent, 'fulfilled')
  RETURNING id INTO v_redemption_id;

  -- Deduct points from student
  UPDATE students
  SET total_points = total_points - p_points_spent
  WHERE id = p_student_id;

  -- Decrease reward stock
  UPDATE rewards
  SET stock = stock - 1
  WHERE id = p_reward_id;

  -- Return success with redemption ID
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Reward redeemed successfully',
    'redemption_id', v_redemption_id,
    'new_points', v_student_points - p_points_spent
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Database error: ' || SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION redeem_reward(UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION redeem_reward(UUID, UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION redeem_reward(UUID, UUID, INTEGER) TO service_role;
