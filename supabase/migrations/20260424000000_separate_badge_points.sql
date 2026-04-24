-- Migration: Separate badge progress (lifetime_points) from spendable balance (total_points)
-- Badges are based on lifetime_points (never decreases).
-- Rewards/redemptions only deduct total_points (spendable balance).

-- 1. Add lifetime_points column to students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS lifetime_points INTEGER NOT NULL DEFAULT 0;

-- 2. Initialize lifetime_points from existing total_points
-- (Assumes current total_points = all points ever earned, which is true before any redemptions)
UPDATE public.students SET lifetime_points = total_points WHERE lifetime_points = 0;

-- 3. Drop old trigger
DROP TRIGGER IF EXISTS trg_update_student_points ON public.point_transactions;

-- 4. Recreate function that updates BOTH total_points and lifetime_points
-- lifetime_points only ever increases (badges are permanent)
CREATE OR REPLACE FUNCTION public.update_student_points()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.students
    SET total_points = total_points + NEW.points_awarded,
        lifetime_points = lifetime_points + NEW.points_awarded
    WHERE id = NEW.student_id;
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    -- total_points: full delta (can go up or down)
    UPDATE public.students
    SET total_points = total_points + (NEW.points_awarded - OLD.points_awarded)
    WHERE id = NEW.student_id;

    -- lifetime_points: only ADD the positive delta (never subtract)
    IF NEW.points_awarded > OLD.points_awarded THEN
      UPDATE public.students
      SET lifetime_points = lifetime_points + (NEW.points_awarded - OLD.points_awarded)
      WHERE id = NEW.student_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    -- total_points: subtract (teacher deleting a transaction)
    UPDATE public.students
    SET total_points = total_points - OLD.points_awarded
    WHERE id = OLD.student_id;

    -- lifetime_points: stays unchanged (badges are permanent)
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- 5. Recreate trigger
CREATE TRIGGER trg_update_student_points
AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_student_points();
