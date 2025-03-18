
export interface Session {
  id: string;
  name: string;
  status: string;
  debug_port?: number;
}

export interface ExecutionStep {
  id: string;
  status: 'completed' | 'failed' | 'pending' | 'in_progress';
  description: string;
  result?: string;
  screenshot?: string;
}

export interface ExecutionResult {
  steps?: ExecutionStep[];
  status?: string;
  error?: string;
}
