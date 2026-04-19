CREATE POLICY "Teachers can update transactions"
ON public.point_transactions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers can delete transactions"
ON public.point_transactions FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_student_points()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.students SET total_points = total_points + NEW.points_awarded WHERE id = NEW.student_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.students SET total_points = total_points + (NEW.points_awarded - OLD.points_awarded) WHERE id = NEW.student_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.students SET total_points = total_points - OLD.points_awarded WHERE id = OLD.student_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_student_points ON public.point_transactions;
CREATE TRIGGER trg_update_student_points
AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_student_points();

CREATE OR REPLACE FUNCTION public.notify_student_on_points()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _student_user_id UUID;
  _subject_name TEXT;
BEGIN
  SELECT user_id INTO _student_user_id FROM public.students WHERE id = NEW.student_id;
  SELECT name INTO _subject_name FROM public.subjects WHERE id = NEW.subject_id;
  IF _student_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body)
    VALUES (_student_user_id, 'You earned points! ⭐',
      'You just earned ' || NEW.points_awarded || ' points in ' || COALESCE(_subject_name, 'a subject') || '!');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_student_on_points ON public.point_transactions;
CREATE TRIGGER trg_notify_student_on_points
AFTER INSERT ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.notify_student_on_points();

DROP TRIGGER IF EXISTS trg_notify_parents_on_points ON public.point_transactions;
CREATE TRIGGER trg_notify_parents_on_points
AFTER INSERT ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.notify_parents_on_points();

ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.point_transactions REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transactions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;