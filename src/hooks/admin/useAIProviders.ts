
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { AIProviderConfig } from './types';
import { AIProvider } from '@/hooks/ai-agents/types';

export function useAIProviders() {
  const [openaiConfig, setOpenaiConfig] = useState<AIProviderConfig>({
    name: "OpenAI",
    api_key: "",
    is_custom: false
  });
  
  const [geminiConfig, setGeminiConfig] = useState<AIProviderConfig>({
    name: "Gemini",
    api_key: "",
    is_custom: false
  });
  
  const [anthropicConfig, setAnthropicConfig] = useState<AIProviderConfig>({
    name: "Anthropic",
    api_key: "",
    is_custom: false
  });
  
  const [customProviders, setCustomProviders] = useState<AIProviderConfig[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);

  // Fetch active sessions count
  const refreshActiveSessionsCount = async () => {
    try {
      const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000).toISOString();
      
      const { count, error } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', fifteenMinutesAgo);
          
      if (error) throw error;
      
      console.log(`Refreshed active sessions count: ${count || 0}`);
      setActiveSessionsCount(count || 0);
      toast.success("Active sessions count refreshed");
    } catch (error: any) {
      console.error('Error refreshing active sessions count:', error);
      toast.error("Failed to refresh active sessions count");
    }
  };

  // Fetch existing providers
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

  // Initialize form with existing data
  useEffect(() => {
    if (providers && providers.length > 0) {
      providers.forEach((provider: AIProvider) => {
        if (provider.name === "OpenAI") {
          setOpenaiConfig({
            ...provider, 
            api_key: provider.api_key || "",
            is_custom: false
          });
        } else if (provider.name === "Gemini") {
          setGeminiConfig({
            ...provider, 
            api_key: provider.api_key || "",
            is_custom: false
          });
        } else if (provider.name === "Anthropic") {
          setAnthropicConfig({
            ...provider, 
            api_key: provider.api_key || "",
            is_custom: false
          });
        } else if (provider.is_custom) {
          setCustomProviders(prev => {
            const exists = prev.some(p => p.id === provider.id);
            if (!exists) {
              return [...prev, {
                ...provider, 
                api_key: provider.api_key || "",
                is_custom: true
              }];
            }
            return prev;
          });
        }
      });
    }
  }, [providers]);

  const saveProvider = async (provider: AIProviderConfig) => {
    if (!provider.name) {
      toast.error('Provider name is required');
      return;
    }
    
    if (!provider.api_key) {
      toast.error('API key is required');
      return;
    }
    
    if (provider.is_custom && !provider.endpoint_url) {
      toast.error('Endpoint URL is required for custom providers');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = provider.id 
        ? await supabase
            .from('ai_providers')
            .update({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            })
            .eq('id', provider.id)
            .select()
        : await supabase
            .from('ai_providers')
            .insert({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            })
            .select();
      
      if (error) throw error;
      
      toast.success(`${provider.name} configuration saved successfully`);
      refetch();
    } catch (error) {
      console.error('Error saving AI provider:', error);
      toast.error('Failed to save provider configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomProvider = async (providerId: string) => {
    if (!providerId) return;
    
    try {
      const { error } = await supabase
        .from('ai_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
      
      setCustomProviders(providers => providers.filter(p => p.id !== providerId));
      toast.success('Provider deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
    }
  };

  const addCustomProvider = (newProvider: AIProviderConfig) => {
    setCustomProviders([...customProviders, { ...newProvider, id: undefined }]);
  };

  return {
    openaiConfig,
    setOpenaiConfig,
    geminiConfig,
    setGeminiConfig,
    anthropicConfig,
    setAnthropicConfig,
    customProviders,
    isLoading,
    isSubmitting,
    saveProvider,
    deleteCustomProvider,
    addCustomProvider,
    activeSessionsCount,
    setActiveSessionsCount,
    refreshActiveSessionsCount
  };
}
