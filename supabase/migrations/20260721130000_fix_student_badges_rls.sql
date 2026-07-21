-- ============================================
-- Fix: "new row violates row-level security policy for table student_badges"
-- 
-- The check_and_award_badges() trigger fires on point_transactions INSERT/UPDATE/DELETE
-- and tries to INSERT into student_badges. However, student_badges only has a SELECT
-- policy. Making the function SECURITY DEFINER lets it bypass RLS, matching the pattern
-- used by notify_on_badge() and other trigger functions in the codebase.
-- ============================================

CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _student_id UUID;
  _lifetime_points INTEGER;
  _badge RECORD;
BEGIN
  -- Get affected student id
  IF TG_OP = 'DELETE' THEN
    _student_id := OLD.student_id;
  ELSE
    _student_id := NEW.student_id;
  END IF;

  -- Recalculate lifetime_points for the student
  SELECT COALESCE(SUM(points_awarded), 0)
  INTO _lifetime_points
  FROM public.point_transactions
  WHERE student_id = _student_id;

  -- Award any newly earned badges
  FOR _badge IN
    SELECT b.id AS badge_id
    FROM public.badges b
    WHERE b.required_points <= _lifetime_points
      AND NOT EXISTS (
        SELECT 1 FROM public.student_badges sb
        WHERE sb.student_id = _student_id AND sb.badge_id = b.id
      )
  LOOP
    INSERT INTO public.student_badges (student_id, badge_id, earned_at)
    VALUES (_student_id, _badge.badge_id, now());
  END LOOP;

  RETURN COALESCE(NEW, OLD);
END;
$$;