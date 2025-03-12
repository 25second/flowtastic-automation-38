
import { ChatOpenAI } from "@langchain/openai";
import { supabase } from "@/integrations/supabase/client";
import { AgentConfig, LLMProvider } from "./types";

export class OpenAIProvider implements LLMProvider {
  async initialize(config: AgentConfig) {
    return new ChatOpenAI({
      modelName: config.model,
      openAIApiKey: config.api_key,
      temperature: config.temperature || 0.2,
    });
  }
}

export class GeminiProvider implements LLMProvider {
  async initialize(config: AgentConfig) {
    // Using dynamic import to avoid bundling issues
    const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
    
    return new ChatGoogleGenerativeAI({
      modelName: config.model,
      apiKey: config.api_key,
      temperature: config.temperature || 0.2,
    });
  }
}

export class AnthropicProvider implements LLMProvider {
  async initialize(config: AgentConfig) {
    // Using dynamic import to avoid bundling issues
    const { ChatAnthropic } = await import("@langchain/anthropic");
    
    return new ChatAnthropic({
      modelName: config.model,
      anthropicApiKey: config.api_key,
      temperature: config.temperature || 0.2,
    });
  }
}

export class CustomProvider implements LLMProvider {
  async initialize(config: AgentConfig) {
    // Handle custom provider logic (e.g., with custom endpoint)
    const { ChatOpenAI } = await import("@langchain/openai");
    
    return new ChatOpenAI({
      modelName: config.model,
      openAIApiKey: config.api_key,
      temperature: config.temperature || 0.2,
      configuration: {
        baseURL: config.endpoint_url,
      },
    });
  }
}

export const getLLMProvider = async (providerId: string): Promise<{ config: AgentConfig, provider: LLMProvider }> => {
  try {
    // Get provider configuration from Supabase
    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .eq('id', providerId)
      .single();
      
    if (error) throw error;
    
    if (!data) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }
    
    const config: AgentConfig = {
      id: data.id,
      name: data.name,
      provider: data.name,
      model: data.model || 'gpt-4o-mini', // Default model
      api_key: data.api_key,
      endpoint_url: data.endpoint_url,
      temperature: 0.2,
    };
    
    let provider: LLMProvider;
    
    // Select the appropriate provider based on name
    if (data.name === 'OpenAI') {
      provider = new OpenAIProvider();
    } else if (data.name === 'Gemini') {
      provider = new GeminiProvider();
    } else if (data.name === 'Anthropic') {
      provider = new AnthropicProvider();
    } else {
      // For custom providers
      provider = new CustomProvider();
    }
    
    return { config, provider };
  } catch (error) {
    console.error('Error getting LLM provider:', error);
    throw error;
  }
};

// Get default provider from settings
export const getDefaultProvider = async (): Promise<{ config: AgentConfig, provider: LLMProvider }> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'default_ai_provider')
      .single();
      
    if (error) throw error;
    
    if (!data || !data.value) {
      // Fallback to OpenAI if no default provider
      const { data: openAIData, error: openAIError } = await supabase
        .from('ai_providers')
        .select('*')
        .eq('name', 'OpenAI')
        .single();
        
      if (openAIError || !openAIData) {
        throw new Error('No default provider found and could not find OpenAI provider');
      }
      
      return getLLMProvider(openAIData.id);
    }
    
    // Get provider ID from settings
    const providerId = typeof data.value === 'object' && data.value !== null 
      ? (data.value as any).provider 
      : null;
      
    if (!providerId) {
      throw new Error('Invalid provider configuration in settings');
    }
    
    return getLLMProvider(providerId);
  } catch (error) {
    console.error('Error getting default provider:', error);
    throw error;
  }
};
