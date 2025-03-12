
import { AIProvider } from '@/hooks/ai-agents/types';

export interface AIProviderConfig {
  id?: string;
  name: string;
  api_key: string;
  endpoint_url?: string;
  is_custom: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface UseAIProvidersReturn {
  openaiConfig: AIProviderConfig;
  setOpenaiConfig: (config: AIProviderConfig) => void;
  geminiConfig: AIProviderConfig;
  setGeminiConfig: (config: AIProviderConfig) => void;
  anthropicConfig: AIProviderConfig;
  setAnthropicConfig: (config: AIProviderConfig) => void;
  customProviders: AIProviderConfig[];
  isLoading: boolean;
  isSubmitting: boolean;
  saveProvider: (provider: AIProviderConfig) => Promise<void>;
  deleteCustomProvider: (providerId: string) => Promise<void>;
  addCustomProvider: (newProvider: AIProviderConfig) => void;
  activeSessionsCount: number;
  setActiveSessionsCount: (count: number) => void;
  refreshActiveSessionsCount: () => Promise<void>;
}
