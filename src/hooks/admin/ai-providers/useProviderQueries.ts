
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIProvider } from '@/hooks/ai-agents/types';

export function useProviderQueries() {
  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ['ai-providers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_providers')
          .select('*');
        
        if (error) {
          console.error('Error fetching AI providers:', error);
          toast.error('Failed to load AI providers');
          return [];
        }
        
        return (data || []) as AIProvider[];
      } catch (err) {
        console.error('Error fetching AI providers:', err);
        return [];
      }
    }
  });

  return {
    providers,
    isLoading,
    refetch
  };
}
