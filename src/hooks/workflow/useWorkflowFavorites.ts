
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkflowFavorites = () => {
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async ({ workflowId, isFavorite }: { workflowId: string, isFavorite: boolean }) => {
      const { data, error } = await supabase
        .from('workflows')
        .update({ is_favorite: isFavorite })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['favorited-workflows'] });
      toast.success('Favorite status updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update favorite status');
      console.error('Error updating favorite:', error);
    }
  });

  const handleToggleFavorite = (workflowId: string, isFavorite: boolean) => {
    toggleFavorite.mutate({ workflowId, isFavorite });
  };

  return { handleToggleFavorite };
};
