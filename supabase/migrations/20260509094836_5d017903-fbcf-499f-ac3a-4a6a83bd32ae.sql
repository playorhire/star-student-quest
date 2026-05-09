
CREATE OR REPLACE FUNCTION public.create_notification(_user_id uuid, _title text, _body text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, title, body, read)
  VALUES (_user_id, _title, _body, false);
END; $$;

CREATE OR REPLACE FUNCTION public.notify_on_point_tx()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_student RECORD; v_parent uuid; v_title text; v_body text; v_pts int;
BEGIN
  SELECT s.user_id, s.name INTO v_student FROM public.students s WHERE s.id = NEW.student_id;
  v_pts := NEW.points_awarded;
  IF NEW.transaction_type = 'spend' OR v_pts < 0 THEN
    v_title := '➖ Points deducted';
    v_body := abs(v_pts)::text || ' points were deducted';
  ELSE
    v_title := '⭐ Points earned!';
    v_body := 'You just earned ' || v_pts::text || ' points';
  END IF;
  PERFORM public.create_notification(v_student.user_id, v_title,
    CASE WHEN NEW.notes IS NOT NULL THEN v_body || ' — ' || NEW.notes ELSE v_body END);
  FOR v_parent IN SELECT parent_user_id FROM public.parent_student_links WHERE student_id = NEW.student_id LOOP
    PERFORM public.create_notification(v_parent,
      CASE WHEN v_pts < 0 OR NEW.transaction_type = 'spend' THEN '➖ ' || v_student.name || ' had points deducted'
           ELSE '⭐ ' || v_student.name || ' earned points!' END, v_body);
  END LOOP;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_point_tx ON public.point_transactions;
CREATE TRIGGER trg_notify_on_point_tx AFTER INSERT ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.notify_on_point_tx();

CREATE OR REPLACE FUNCTION public.notify_on_badge()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_student RECORD; v_badge RECORD; v_parent uuid;
BEGIN
  SELECT s.user_id, s.name INTO v_student FROM public.students s WHERE s.id = NEW.student_id;
  SELECT b.name, b.emoji INTO v_badge FROM public.badges b WHERE b.id = NEW.badge_id;
  PERFORM public.create_notification(v_student.user_id,
    (COALESCE(v_badge.emoji,'🏅') || ' New badge unlocked!'),
    'You earned the "' || v_badge.name || '" badge');
  FOR v_parent IN SELECT parent_user_id FROM public.parent_student_links WHERE student_id = NEW.student_id LOOP
    PERFORM public.create_notification(v_parent,
      (COALESCE(v_badge.emoji,'🏅') || ' ' || v_student.name || ' earned a badge!'),
      'New badge: "' || v_badge.name || '"');
  END LOOP;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_badge ON public.student_badges;
CREATE TRIGGER trg_notify_on_badge AFTER INSERT ON public.student_badges
FOR EACH ROW EXECUTE FUNCTION public.notify_on_badge();

CREATE OR REPLACE FUNCTION public.notify_on_redemption()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_student RECORD; v_reward RECORD; v_title text; v_body text;
BEGIN
  SELECT s.user_id, s.name INTO v_student FROM public.students s WHERE s.id = NEW.student_id;
  SELECT r.name, r.emoji INTO v_reward FROM public.rewards r WHERE r.id = NEW.reward_id;
  IF TG_OP = 'INSERT' THEN
    v_title := (COALESCE(v_reward.emoji,'🎁') || ' Redemption requested');
    v_body := 'Your request for "' || v_reward.name || '" is pending (' || NEW.points_spent || ' pts)';
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    v_title := (COALESCE(v_reward.emoji,'🎁') || ' Redemption ' || NEW.status);
    v_body := '"' || v_reward.name || '" is now ' || NEW.status;
  ELSE RETURN NEW; END IF;
  PERFORM public.create_notification(v_student.user_id, v_title, v_body);
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_redemption ON public.redemptions;
CREATE TRIGGER trg_notify_on_redemption AFTER INSERT OR UPDATE OF status ON public.redemptions
FOR EACH ROW EXECUTE FUNCTION public.notify_on_redemption();

CREATE OR REPLACE FUNCTION public.notify_on_house_rank()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_old_rank int; v_new_rank int; v_member RECORD;
BEGIN
  IF OLD.total_points = NEW.total_points THEN RETURN NEW; END IF;
  SELECT 1 + COUNT(*) INTO v_new_rank FROM public.houses
    WHERE branch_id = NEW.branch_id AND total_points > NEW.total_points;
  SELECT 1 + COUNT(*) INTO v_old_rank FROM public.houses
    WHERE branch_id = NEW.branch_id AND id <> NEW.id AND total_points > OLD.total_points;
  IF v_new_rank = 1 AND v_old_rank > 1 THEN
    FOR v_member IN
      SELECT user_id FROM public.students WHERE house_id = NEW.id AND user_id IS NOT NULL
      UNION
      SELECT user_id FROM public.teachers WHERE house_id = NEW.id AND user_id IS NOT NULL
    LOOP
      PERFORM public.create_notification(v_member.user_id,
        '🏆 ' || NEW.name || ' is now #1!',
        'Your house just took the lead with ' || NEW.total_points || ' points');
    END LOOP;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_house_rank ON public.houses;
CREATE TRIGGER trg_notify_on_house_rank AFTER UPDATE OF total_points ON public.houses
FOR EACH ROW EXECUTE FUNCTION public.notify_on_house_rank();
