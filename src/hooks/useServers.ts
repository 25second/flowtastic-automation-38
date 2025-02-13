
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useServers = () => {
  const { data: servers = [], error, isError } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      try {
        console.log('Fetching servers...');
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          toast.error('Failed to load servers');
          throw error;
        }

        console.log('Servers fetched successfully:', data);
        return data || [];
      } catch (err) {
        console.error('Error in useServers:', err);
        toast.error('Failed to load servers');
        throw err;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: [],
  });

  if (isError) {
    console.error('Query error:', error);
  }

  return { servers };
};
