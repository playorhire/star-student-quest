CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage parents" ON public.parents FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can update own profile" ON public.parents FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can view parents" ON public.parents FOR SELECT
TO authenticated USING (true);

CREATE TRIGGER update_parents_updated_at
BEFORE UPDATE ON public.parents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();