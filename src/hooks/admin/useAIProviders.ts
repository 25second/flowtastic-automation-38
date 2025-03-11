
import { useState, useEffect } from 'react';
import { AIProvider } from '@/hooks/ai-agents/types';
import { AIProviderConfig, UseAIProvidersReturn } from './ai-providers/types';
import { useActiveSessions } from './ai-providers/useActiveSessions';
import { useProviderMutations } from './ai-providers/useProviderMutations';
import { useProviderQueries } from './ai-providers/useProviderQueries';

export function useAIProviders(): UseAIProvidersReturn {
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
  
  const { 
    activeSessionsCount, 
    setActiveSessionsCount, 
    refreshActiveSessionsCount 
  } = useActiveSessions();
  
  const { 
    isSubmitting, 
    saveProvider: saveMutation, 
    deleteCustomProvider: deleteMutation 
  } = useProviderMutations();
  
  const { providers, isLoading, refetch } = useProviderQueries();

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
    const result = await saveMutation(provider);
    if (result) {
      refetch();
    }
  };

  const deleteCustomProvider = async (providerId: string) => {
    const success = await deleteMutation(providerId);
    if (success) {
      setCustomProviders(providers => providers.filter(p => p.id !== providerId));
      refetch();
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
