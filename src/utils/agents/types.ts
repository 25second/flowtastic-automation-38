
import { Page } from "playwright";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type AgentStep = {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  screenshot?: string;
};

export type AgentState = {
  messages: Array<{ role: 'function' | 'system' | 'user' | 'assistant', content: string }>;
  task: string;
  steps: AgentStep[];
  current_step: number;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error';
  error?: string;
  browser_state: {
    url: string;
    title: string;
    isNavigating: boolean;
    elements: any[];
  };
  memory: Record<string, any>;
};

export type AgentConfig = {
  model: string;
  maxTokens?: number;
  temperature?: number;
  apiKey?: string;
  endpointUrl?: string;
};

export type AgentContext = {
  userTask: string;
  config: AgentConfig;
  sessionId: string;
  takeScreenshots?: boolean;
  browserPort: number;
  tableId?: string;
};

// Add the LLMProvider interface that was missing
export interface LLMProvider {
  initialize(config: AgentConfig): Promise<BaseChatModel>;
}

// Add the AgentData type that was missing
export interface AgentData {
  id: string;
  name: string;
  description?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  is_favorite?: boolean;
  color?: string;
  task_description?: string;
  take_screenshots?: boolean;
  table_id?: string;
  script?: string;
  tags?: string[] | string;
  category_id?: string;
  ai_provider?: string;
  model?: string;
}
