import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface VoteCounts {
  upvotes: number;
  downvotes: number;
  userVote: 'upvote' | 'downvote' | null;
}

export const useVoting = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const vote = async (reportId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('report_votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_id', reportId)
        .single();

      if (existingVote) {
        // If same vote type, remove the vote
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('report_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update to new vote type
          await supabase
            .from('report_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('report_votes')
          .insert({
            user_id: user.id,
            report_id: reportId,
            vote_type: voteType,
          });
      }

      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully.",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVoteCounts = async (reportId: string): Promise<VoteCounts> => {
    try {
      const { data: votes } = await supabase
        .from('report_votes')
        .select('vote_type, user_id')
        .eq('report_id', reportId);

      const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
      const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;
      
      let userVote: 'upvote' | 'downvote' | null = null;
      if (user) {
        const userVoteData = votes?.find(v => v.user_id === user.id);
        userVote = userVoteData?.vote_type as 'upvote' | 'downvote' | null;
      }

      return { upvotes, downvotes, userVote };
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      return { upvotes: 0, downvotes: 0, userVote: null };
    }
  };

  return {
    vote,
    getVoteCounts,
    loading
  };
};