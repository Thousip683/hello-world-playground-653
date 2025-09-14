-- Fix RLS policies for civic_reports to allow proper data access
-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "Anyone can insert civic reports" ON public.civic_reports;
DROP POLICY IF EXISTS "Anyone can read civic reports" ON public.civic_reports;
DROP POLICY IF EXISTS "Anyone can update civic reports" ON public.civic_reports;

-- Create storage bucket for civic reports
INSERT INTO storage.buckets (id, name, public) VALUES ('civic-reports', 'civic-reports', true);

-- Create proper RLS policies for civic_reports
CREATE POLICY "Users can view all reports" 
ON public.civic_reports 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reports" 
ON public.civic_reports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own reports" 
ON public.civic_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage policies for file uploads
CREATE POLICY "Anyone can view civic report files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'civic-reports');

CREATE POLICY "Authenticated users can upload civic report files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'civic-reports' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'civic-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'civic-reports' AND auth.uid()::text = (storage.foldername(name))[1]);