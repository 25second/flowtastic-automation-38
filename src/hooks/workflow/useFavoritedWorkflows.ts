
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

export const useFavoritedWorkflows = (session: Session | null) => {
  const queryClient = useQueryClient();

  const { data: favoritedWorkflows, isLoading } = useQuery({
    queryKey: ['favorited-workflows', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      console.log('Fetching favorited workflows for user:', session.user.id);
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorited workflows:', error);
        toast.error('Failed to load favorited workflows');
        throw error;
      }

      console.log('Fetched favorited workflows:', data);
      return data;
    },
    enabled: !!session?.user,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ workflowId, isFavorite }: { workflowId: string, isFavorite: boolean }) => {
      const { data, error } = await supabase
        .from('workflows')
        .update({ is_favorite: isFavorite })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) {
        console.error('Error updating favorite status:', error);
        toast.error('Failed to update favorite status');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorited-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return { 
    favoritedWorkflows, 
    isLoading,
    toggleFavorite 
  };
};
