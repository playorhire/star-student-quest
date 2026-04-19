-- Add a short, human-friendly student code for manual entry when QR scanning fails
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_code TEXT UNIQUE;

-- Backfill existing students with a 6-char uppercase code derived from their id
UPDATE public.students
SET student_code = UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 6))
WHERE student_code IS NULL;

-- Function to generate a unique 6-char alphanumeric code
CREATE OR REPLACE FUNCTION public.generate_student_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  _code TEXT;
  _exists BOOLEAN;
BEGIN
  LOOP
    _code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.students WHERE student_code = _code) INTO _exists;
    EXIT WHEN NOT _exists;
  END LOOP;
  RETURN _code;
END;
$$;

-- Trigger to auto-assign code on insert
CREATE OR REPLACE FUNCTION public.set_student_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.student_code IS NULL THEN
    NEW.student_code := public.generate_student_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_student_code ON public.students;
CREATE TRIGGER trg_set_student_code
BEFORE INSERT ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.set_student_code();

-- Make NOT NULL once backfill is done
ALTER TABLE public.students ALTER COLUMN student_code SET NOT NULL;