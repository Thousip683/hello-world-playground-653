import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  photo_urls?: string[];
  voice_note_url?: string;
  user_id?: string;
  assigned_department?: string;
  staff_notes?: string;
  public_notes?: string[];
  internal_notes?: string[];
  created_at: string;
  updated_at: string;
  date_acknowledged?: string;
  date_in_progress?: string;
  date_resolved?: string;
  citizen_name?: string;
  citizen_email?: string;
  citizen_phone?: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('civic_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data || []) as any);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load reports: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: {
    title: string;
    description: string;
    category: string;
    location_address?: string;
    location_lat?: number;
    location_lng?: number;
    photo_urls?: string[];
  }) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to submit a report');
      }

      const { data, error } = await supabase
        .from('civic_reports')
        .insert({
          ...reportData,
          user_id: user.id,
          status: 'submitted',
          priority: 'medium'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report submitted successfully!",
      });

      await fetchReports(); // Refresh reports
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit report: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const uploadMedia = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${user?.id || 'anonymous'}/${fileName}`;

      const { error, data } = await supabase.storage
        .from('civic-media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('civic-media')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const updateReport = async (reportId: string, updates: {
    status?: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
    priority?: 'low' | 'medium' | 'high';
    assigned_department?: string;
    public_notes?: string[];
    internal_notes?: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('civic_reports')
        .update(updates as any)
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report updated successfully!",
      });

      await fetchReports(); // Refresh reports
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update report: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const addNote = async (reportId: string, note: string, isPublic: boolean = true) => {
    try {
      const { data: currentReport, error: fetchError } = await supabase
        .from('civic_reports')
        .select('public_notes, internal_notes')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      const fieldName = isPublic ? 'public_notes' : 'internal_notes';
      const currentNotes = currentReport[fieldName] || [];
      const updatedNotes = [...currentNotes, note];

      const { data, error } = await supabase
        .from('civic_reports')
        .update({ [fieldName]: updatedNotes })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${isPublic ? 'Public' : 'Internal'} note added successfully!`,
      });

      await fetchReports(); // Refresh reports
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add note: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    fetchReports,
    createReport,
    uploadMedia,
    updateReport,
    addNote
  };
};