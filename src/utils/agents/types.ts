
import { Page } from "playwright";

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
};

export type AgentContext = {
  userTask: string;
  config: AgentConfig;
  sessionId: string;
  takeScreenshots?: boolean;
  browserPort: number;
};
