
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIProviderConfig } from './types';

export function useProviderQueries() {
  const { data: providers, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-providers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_providers')
          .select('*');
        
        if (error) {
          console.error('Error fetching AI providers:', error);
          toast.error('Failed to load AI providers');
          throw error;
        }
        
        // Ensure all providers have required fields for AIProviderConfig
        return (data || []).map(provider => ({
          ...provider,
          api_key: provider.api_key || '',
          is_custom: provider.is_custom || false,
          name: provider.name || ''
        })) as AIProviderConfig[];
      } catch (err) {
        console.error('Error fetching AI providers:', err);
        throw err;
      }
    }
  });

  return {
    providers: providers || [],
    isLoading,
    error,
    refetch
  };
}

