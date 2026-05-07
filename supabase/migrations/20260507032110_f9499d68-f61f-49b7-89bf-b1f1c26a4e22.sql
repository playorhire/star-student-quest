-- Houses table
CREATE TABLE public.houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#ef4444',
  emoji TEXT NOT NULL DEFAULT '🏠',
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch_id, name)
);

CREATE INDEX idx_houses_branch ON public.houses(branch_id);
CREATE INDEX idx_houses_school ON public.houses(school_id);

ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Houses select same school"
ON public.houses FOR SELECT TO authenticated
USING (is_super_admin() OR school_id = get_my_school_id_safe());

CREATE POLICY "Branch admins manage houses in branch"
ON public.houses FOR ALL TO authenticated
USING (
  is_super_admin()
  OR (get_user_role() = 'school_admin' AND school_id = get_my_school_id_safe())
  OR (get_user_role() = 'branch_admin' AND branch_id = get_my_branch_id_safe())
)
WITH CHECK (
  is_super_admin()
  OR (get_user_role() = 'school_admin' AND school_id = get_my_school_id_safe())
  OR (get_user_role() = 'branch_admin' AND branch_id = get_my_branch_id_safe())
);

CREATE TRIGGER trg_houses_updated_at
BEFORE UPDATE ON public.houses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add house_id to students and teachers
ALTER TABLE public.students ADD COLUMN house_id UUID REFERENCES public.houses(id) ON DELETE SET NULL;
ALTER TABLE public.teachers ADD COLUMN house_id UUID REFERENCES public.houses(id) ON DELETE SET NULL;
CREATE INDEX idx_students_house ON public.students(house_id);
CREATE INDEX idx_teachers_house ON public.teachers(house_id);

-- Trigger: maintain houses.total_points based on point_transactions
CREATE OR REPLACE FUNCTION public.update_house_points_on_tx()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _old_house UUID;
  _new_house UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT house_id INTO _new_house FROM public.students WHERE id = NEW.student_id;
    IF _new_house IS NOT NULL THEN
      UPDATE public.houses SET total_points = total_points + NEW.points_awarded WHERE id = _new_house;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT house_id INTO _new_house FROM public.students WHERE id = NEW.student_id;
    IF _new_house IS NOT NULL THEN
      UPDATE public.houses
      SET total_points = total_points + (NEW.points_awarded - OLD.points_awarded)
      WHERE id = _new_house;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT house_id INTO _old_house FROM public.students WHERE id = OLD.student_id;
    IF _old_house IS NOT NULL THEN
      UPDATE public.houses SET total_points = total_points - OLD.points_awarded WHERE id = _old_house;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_house_points_on_tx
AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_house_points_on_tx();

-- Trigger: when a student's house_id changes, recompute affected houses from scratch
CREATE OR REPLACE FUNCTION public.recompute_house_on_student_move()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.house_id IS DISTINCT FROM OLD.house_id THEN
    IF OLD.house_id IS NOT NULL THEN
      UPDATE public.houses h SET total_points = COALESCE((
        SELECT SUM(pt.points_awarded) FROM public.point_transactions pt
        JOIN public.students s ON s.id = pt.student_id
        WHERE s.house_id = OLD.house_id
      ), 0)
      WHERE h.id = OLD.house_id;
    END IF;
    IF NEW.house_id IS NOT NULL THEN
      UPDATE public.houses h SET total_points = COALESCE((
        SELECT SUM(pt.points_awarded) FROM public.point_transactions pt
        JOIN public.students s ON s.id = pt.student_id
        WHERE s.house_id = NEW.house_id
      ), 0)
      WHERE h.id = NEW.house_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_recompute_house_on_student_move
AFTER UPDATE OF house_id ON public.students
FOR EACH ROW EXECUTE FUNCTION public.recompute_house_on_student_move();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.houses;