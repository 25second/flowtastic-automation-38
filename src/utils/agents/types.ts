
export interface AgentState {
  messages: AgentMessage[];
  task: string;
  steps: AgentStep[];
  current_step: number;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error';
  browser_state: BrowserState;
  memory: Record<string, any>;
  screenshot?: string;
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
  description?: string;
  provider: string;
  model: string;
  api_key: string;
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
  type: 'click' | 'type' | 'navigate' | 'wait' | 'extract';
  params: Record<string, any>;
}
