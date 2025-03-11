
import { useState } from 'react';
import { AIProviderConfig } from './ai-providers/types';
import { useProviderQueries } from './ai-providers/useProviderQueries';
import { useProviderMutations } from './ai-providers/useProviderMutations';
import { useActiveSessions } from './ai-providers/useActiveSessions';

export function useAIProviders() {
  const [openaiConfig, setOpenaiConfig] = useState<AIProviderConfig>({
    name: 'OpenAI',
    api_key: '',
    is_custom: false
  });
  
  const [geminiConfig, setGeminiConfig] = useState<AIProviderConfig>({
    name: 'Gemini',
    api_key: '',
    is_custom: false
  });
  
  const [anthropicConfig, setAnthropicConfig] = useState<AIProviderConfig>({
    name: 'Anthropic',
    api_key: '',
    is_custom: false
  });
  
  const [customProviders, setCustomProviders] = useState<AIProviderConfig[]>([]);
  
  const { providers, isLoading, refetch } = useProviderQueries();
  const { saveProvider, deleteProvider, isSubmitting } = useProviderMutations();
  const { activeSessionsCount, setActiveSessionsCount, refreshActiveSessionsCount } = useActiveSessions();
  
  // Populate state from loaded providers
  if (providers && providers.length > 0 && !isLoading && customProviders.length === 0) {
    const openai = providers.find(p => p.name === 'OpenAI' && !p.is_custom);
    const gemini = providers.find(p => p.name === 'Gemini' && !p.is_custom);
    const anthropic = providers.find(p => p.name === 'Anthropic' && !p.is_custom);
    const custom = providers.filter(p => p.is_custom);
    
    if (openai) setOpenaiConfig(openai);
    if (gemini) setGeminiConfig(gemini);
    if (anthropic) setAnthropicConfig(anthropic);
    if (custom.length > 0) setCustomProviders(custom);
  }
  
  const addCustomProvider = (provider: AIProviderConfig) => {
    setCustomProviders([...customProviders, provider]);
  };
  
  const deleteCustomProvider = async (providerId: string) => {
    try {
      await deleteProvider(providerId);
      setCustomProviders(customProviders.filter(p => p.id !== providerId));
    } catch (error) {
      console.error('Error deleting provider:', error);
      throw error;
    }
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
