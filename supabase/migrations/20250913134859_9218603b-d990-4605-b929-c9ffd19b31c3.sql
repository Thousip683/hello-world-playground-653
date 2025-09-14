-- Fix security warnings
-- Fix function search path for update_status_dates function
CREATE OR REPLACE FUNCTION public.update_status_dates()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update date fields based on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'acknowledged' THEN
        NEW.date_acknowledged = COALESCE(OLD.date_acknowledged, now());
      WHEN 'in-progress' THEN
        NEW.date_acknowledged = COALESCE(OLD.date_acknowledged, now());
        NEW.date_in_progress = COALESCE(OLD.date_in_progress, now());
      WHEN 'resolved' THEN
        NEW.date_acknowledged = COALESCE(OLD.date_acknowledged, now());
        NEW.date_in_progress = COALESCE(OLD.date_in_progress, now());
        NEW.date_resolved = COALESCE(OLD.date_resolved, now());
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;