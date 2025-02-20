
export interface WorkflowExecutionParams {
  browserType: 'chrome' | 'linkenSphere';
  browserPort: number;
  sessionId?: string;
}

export interface BrowserConnection {
  port: number;
  debugPort: number;
  browserType: 'chrome' | 'linkenSphere';
  sessionId?: string;
  browserInfo: any;
  wsEndpoint: string | null;
  isAutomationRunning: boolean;
}
