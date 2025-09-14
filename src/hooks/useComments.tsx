import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Comment {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
  user_id: string;
}

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchComments = async (reportId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('report_comments')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (reportId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a comment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('report_comments')
        .insert({
          report_id: reportId,
          user_id: user.id,
          content: content.trim(),
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    fetchComments,
    addComment,
    loading,
  };
};