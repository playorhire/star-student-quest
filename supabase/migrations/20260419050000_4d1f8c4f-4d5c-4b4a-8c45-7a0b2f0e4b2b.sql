-- Add minimum and maximum marks constraints to point rules
ALTER TABLE public.point_rules
  ADD COLUMN min_marks INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN max_marks INTEGER NOT NULL DEFAULT 100;
