-- Allow super admins to award points without attributing the award to a
-- teacher or academic subject. The transaction remains in the normal ledger,
-- so student balances and badge-award triggers continue to update.
ALTER TABLE public.point_transactions
  ALTER COLUMN teacher_id DROP NOT NULL,
  ALTER COLUMN subject_id DROP NOT NULL;

ALTER TABLE public.point_transactions
  DROP CONSTRAINT IF EXISTS point_transactions_teacher_id_fkey,
  DROP CONSTRAINT IF EXISTS point_transactions_subject_id_fkey;

ALTER TABLE public.point_transactions
  ADD CONSTRAINT point_transactions_teacher_id_fkey
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL,
  ADD CONSTRAINT point_transactions_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;
