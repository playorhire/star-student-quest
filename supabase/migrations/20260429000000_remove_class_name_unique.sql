-- Remove UNIQUE constraint on classes.name to allow multiple branches to have same class names
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_name_key;
