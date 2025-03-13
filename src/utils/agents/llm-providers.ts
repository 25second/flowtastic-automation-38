
import { ChatOpenAI } from "@langchain/openai";
import { supabase } from "@/integrations/supabase/client";
import { AgentConfig, LLMProvider } from "./types";

export class OpenAIProvider implements LLMProvider {
  async initialize(config: AgentConfig) {
    return new ChatOpenAI({
      modelName: config.model,
      openAIApiKey: config.apiKey,
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
      apiKey: config.apiKey,
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
      anthropicApiKey: config.apiKey,
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
      openAIApiKey: config.apiKey,
      temperature: config.temperature || 0.2,
      configuration: {
        baseURL: config.endpointUrl,
      },
    });
  }
}

export const getLLMProvider = async (providerId: string): Promise<{ config: AgentConfig, provider: LLMProvider }> => {
  try {
    console.log('Getting LLM provider for ID:', providerId);
    // Get provider configuration from Supabase
    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .eq('id', providerId)
      .single();
      
    if (error) {
      console.error('Supabase error getting provider:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }
    
    console.log('Provider data from Supabase:', data);
    
    // Define default model based on provider name if not specified
    const defaultModel = data.name === 'OpenAI' ? 'gpt-4o-mini' :
                         data.name === 'Gemini' ? 'gemini-pro' :
                         data.name === 'Anthropic' ? 'claude-3-sonnet-20240229' :
                         'gpt-4o-mini'; // Default fallback
    
    const config: AgentConfig = {
      model: data.model || defaultModel, // Use model from data if available, otherwise use default
      apiKey: data.api_key,
      endpointUrl: data.endpoint_url,
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
      
    if (error) {
      console.error('Error getting default provider setting:', error);
      throw error;
    }
    
    if (!data || !data.value) {
      console.log('No default provider found, falling back to OpenAI');
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
