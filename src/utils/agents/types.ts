export interface AgentState {
  messages: any[];
  task: string;
  steps: any[];
  current_step: number;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error';
  browser_state: BrowserState;
  memory: any;
  error?: string;
}

export interface BrowserState {
  url: string;
  title: string;
  isNavigating: boolean;
  elements: any[];
}

export interface LLMProvider {
  initialize(config: AgentConfig): Promise<any>;
}

export interface AgentData {
  id: string;
  name: string;
  description?: string;
  status: string;
  user_id: string;
  is_favorite?: boolean;
  color?: string;
  task_description?: string;
  take_screenshots?: boolean;
  table_id?: string;
  script?: string;
  ai_provider?: string;
  model?: string;
}

export interface AgentContext {
  userTask: string;
  sessionId: string;
  browserPort: number;
  tableId?: string;
  takeScreenshots: boolean;
  config: AgentConfig;
}

export interface AgentConfig {
  model: string;
  apiKey?: string;
  endpointUrl?: string;
  temperature?: number;
}
