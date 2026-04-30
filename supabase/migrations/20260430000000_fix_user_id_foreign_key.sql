-- Fix incorrect foreign key constraint on students.user_id
-- The constraint was incorrectly pointing to a 'profiles' table instead of auth.users

-- Drop the incorrect constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'students_user_id_profiles_fkey'
    ) THEN
        ALTER TABLE public.students DROP CONSTRAINT students_user_id_profiles_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint referencing auth.users
ALTER TABLE public.students 
ADD CONSTRAINT students_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Fix the same issue for teachers table if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'teachers_user_id_profiles_fkey'
    ) THEN
        ALTER TABLE public.teachers DROP CONSTRAINT teachers_user_id_profiles_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint for teachers (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'teachers_user_id_fkey'
    ) THEN
        ALTER TABLE public.teachers 
        ADD CONSTRAINT teachers_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
