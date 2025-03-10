
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define proper types based on the database schema
type Workflow = Database['public']['Tables']['workflows']['Row'];

export const useFavoritedWorkflows = (session: Session | null) => {
  const queryClient = useQueryClient();

  // Query for favorited workflows
  const { data: favoritedWorkflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['favorited-workflows', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load favorited workflows');
        throw error;
      }

      return data as Workflow[];
    },
    enabled: !!session?.user,
  });

  // Query for favorited agents
  const { data: favoritedAgents, isLoading: agentsLoading } = useQuery({
    queryKey: ['favorited-agents', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load favorited agents');
        throw error;
      }

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
        toast.error('Failed to update favorite status');
        throw error;
      }

      return data as Workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorited-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  return { 
    favoritedWorkflows, 
    favoritedAgents,
    isLoading: workflowsLoading || agentsLoading,
    toggleFavorite 
  };
};
