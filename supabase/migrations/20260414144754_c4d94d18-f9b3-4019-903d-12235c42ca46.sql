
DROP POLICY "Authenticated users can update alerts" ON public.alerts_and_notifications;
CREATE POLICY "Authenticated users can mark alerts as read" ON public.alerts_and_notifications
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (is_read = true);
