-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view classes" ON public.classes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  qr_code TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  total_points INTEGER NOT NULL DEFAULT 0,
  avatar_emoji TEXT NOT NULL DEFAULT '🧑‍🎓',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view students" ON public.students
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view teachers" ON public.teachers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage teachers" ON public.teachers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view subjects" ON public.subjects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Point rules table
CREATE TABLE public.point_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  passing_marks INTEGER NOT NULL DEFAULT 35,
  multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.point_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view point_rules" ON public.point_rules
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage point_rules" ON public.point_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Teacher assignments
CREATE TABLE public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, class_id, subject_id)
);
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view assignments" ON public.teacher_assignments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage assignments" ON public.teacher_assignments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Point transactions
CREATE TABLE public.point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  marks_entered INTEGER NOT NULL,
  passing_marks INTEGER NOT NULL,
  multiplier NUMERIC(4,2) NOT NULL,
  points_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view transactions" ON public.point_transactions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can insert transactions" ON public.point_transactions
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage transactions" ON public.point_transactions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '⭐',
  required_points INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view badges" ON public.badges
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Rewards
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '🎁',
  point_cost INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Items',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view rewards" ON public.rewards
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage rewards" ON public.rewards
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Redemptions
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own redemptions" ON public.redemptions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Students can create redemptions" ON public.redemptions
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins can manage redemptions" ON public.redemptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Parent-student links
CREATE TABLE public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_user_id, student_id)
);
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view own links" ON public.parent_student_links
  FOR SELECT TO authenticated USING (auth.uid() = parent_user_id);
CREATE POLICY "Admins can manage links" ON public.parent_student_links
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Messages (parent-teacher)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can mark as read" ON public.messages
  FOR UPDATE TO authenticated USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can mark own notifications as read" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Function: update student total_points after transaction
CREATE OR REPLACE FUNCTION public.update_student_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.students
  SET total_points = total_points + NEW.points_awarded
  WHERE id = NEW.student_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_student_points
  AFTER INSERT ON public.point_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_student_points();

-- Function: create notification for parents when points awarded
CREATE OR REPLACE FUNCTION public.notify_parents_on_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _student_name TEXT;
  _subject_name TEXT;
  _parent_user_id UUID;
BEGIN
  SELECT name INTO _student_name FROM public.students WHERE id = NEW.student_id;
  SELECT name INTO _subject_name FROM public.subjects WHERE id = NEW.subject_id;
  
  FOR _parent_user_id IN
    SELECT parent_user_id FROM public.parent_student_links WHERE student_id = NEW.student_id
  LOOP
    INSERT INTO public.notifications (user_id, title, body)
    VALUES (
      _parent_user_id,
      'Points Earned! 🎉',
      'Your child ' || _student_name || ' earned ' || NEW.points_awarded || ' points in ' || COALESCE(_subject_name, 'a subject') || ' today!'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_parents
  AFTER INSERT ON public.point_transactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_parents_on_points();

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Seed badges
INSERT INTO public.badges (name, description, emoji, required_points) VALUES
  ('Rising Star', 'Earn your first 100 points', '⭐', 100),
  ('Scholar', 'Earn 250 points', '📚', 250),
  ('Achiever', 'Earn 500 points', '🏆', 500),
  ('Champion', 'Earn 750 points', '👑', 750),
  ('Legend', 'Earn 1000 points', '🌟', 1000);

-- Seed rewards
INSERT INTO public.rewards (name, description, emoji, point_cost, stock, category) VALUES
  ('Extra Recess', '30 minutes extra recess time', '🎮', 100, 10, 'Privileges'),
  ('Homework Pass', 'Skip one homework assignment', '📝', 150, 5, 'Privileges'),
  ('Sticker Pack', 'Cool holographic sticker pack', '✨', 50, 20, 'Items'),
  ('Notebook Set', 'Premium notebook set', '📓', 200, 8, 'Items'),
  ('Lunch with Teacher', 'Special lunch with your favorite teacher', '🍕', 300, 3, 'Experiences'),
  ('Class DJ', 'Choose music during free period', '🎵', 250, 2, 'Privileges');