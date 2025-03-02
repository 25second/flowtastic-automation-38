
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

export const useWorkflowFetching = (session: Session | null) => {
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      console.log('Fetching workflows for user:', session.user.id);
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        toast.error('Failed to load workflows');
        throw error;
      }

      console.log('Fetched workflows:', data);
      return data;
    },
    enabled: !!session?.user,
  });

  const refreshWorkflows = () => {
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
  };

  return { workflows, isLoading, refreshWorkflows };
};
