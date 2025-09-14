-- Update database structure to match specifications
-- First, let's add the missing columns and modify existing ones

-- Add missing columns to civic_reports table
ALTER TABLE public.civic_reports 
ADD COLUMN IF NOT EXISTS date_acknowledged TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS date_in_progress TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS date_resolved TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS public_notes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS internal_notes TEXT[] DEFAULT '{}';

-- Update existing columns if needed
ALTER TABLE public.civic_reports 
ALTER COLUMN photo_urls SET DEFAULT '{}';

-- Create function to automatically update date fields based on status changes
CREATE OR REPLACE FUNCTION public.update_status_dates()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for status date updates
DROP TRIGGER IF EXISTS update_civic_reports_status_dates ON public.civic_reports;
CREATE TRIGGER update_civic_reports_status_dates
  BEFORE UPDATE ON public.civic_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_status_dates();

-- Create media storage bucket for photos, videos, and voice recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('civic-media', 'civic-media', true) 
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for media bucket
-- Allow public read access to media files
CREATE POLICY "Public access to civic media" ON storage.objects
FOR SELECT USING (bucket_id = 'civic-media');

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload civic media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'civic-media' AND 
  auth.role() = 'authenticated'
);

-- Allow users to update their own media files
CREATE POLICY "Users can update their own civic media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'civic-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own media files
CREATE POLICY "Users can delete their own civic media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'civic-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable realtime for civic_reports table
ALTER PUBLICATION supabase_realtime ADD TABLE public.civic_reports;