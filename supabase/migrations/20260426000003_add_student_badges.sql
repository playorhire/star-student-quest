-- ============================================
-- Track earned badges per student with earned date
-- ============================================

-- 1. Create student_badges table
CREATE TABLE IF NOT EXISTS public.student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, badge_id)
);

ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- 2. RLS: students can view their own earned badges
DROP POLICY IF EXISTS "student_badges_select" ON public.student_badges;
CREATE POLICY "student_badges_select"
ON public.student_badges FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = student_id AND s.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND tenant_role = 'super_admin' AND is_primary = true
  )
);

-- 3. Function to auto-award badges when lifetime_points crosses thresholds
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- 4. Trigger on point_transactions
DROP TRIGGER IF EXISTS trg_check_and_award_badges ON public.point_transactions;
CREATE TRIGGER trg_check_and_award_badges
AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.check_and_award_badges();

-- 5. Backfill: award badges for all existing students based on current lifetime_points
INSERT INTO public.student_badges (student_id, badge_id, earned_at)
SELECT s.id, b.id, now()
FROM public.students s
CROSS JOIN public.badges b
WHERE (s.lifetime_points IS NOT NULL AND s.lifetime_points >= b.required_points)
   OR (s.lifetime_points IS NULL AND s.total_points >= b.required_points)
ON CONFLICT (student_id, badge_id) DO NOTHING;

-- 6. Grant select to authenticated
GRANT SELECT ON public.student_badges TO authenticated;
