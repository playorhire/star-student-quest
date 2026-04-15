-- Drop the overly permissive insert policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only admins can directly insert notifications (triggers use SECURITY DEFINER and bypass RLS)
CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));