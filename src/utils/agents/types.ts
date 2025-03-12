
import { BaseMessage } from "@langchain/core/messages";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";

export interface AgentState {
  messages: AgentMessage[];
  task: string;
  steps: AgentStep[];
  current_step: number;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error';
  browser_state: BrowserState;
  memory: Record<string, any>;
  screenshot?: string;
  error?: string;
}

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

export interface AgentStep {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  screenshot?: string;
}

export interface BrowserState {
  url: string;
  title: string;
  isNavigating: boolean;
  elements: BrowserElement[];
}

export interface BrowserElement {
  selector: string;
  text: string;
  tag: string;
  attributes: Record<string, string>;
  visible: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  api_key: string;
  endpoint_url?: string;
  temperature?: number;
}

export interface AgentContext {
  userTask: string;
  sessionId: string;
  browserPort: number;
  tableId?: string;
  takeScreenshots?: boolean;
  config: AgentConfig;
}

export interface BrowserAction {
  type: 'click' | 'type' | 'navigate' | 'wait' | 'extract' | 'table';
  params: Record<string, any>;
}

export interface LLMProvider {
  initialize: (config: AgentConfig) => Promise<any>;
}

// This interface specifically describes what's returned from the database
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
