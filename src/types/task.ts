
interface BrowserSession {
  id: string;
  name?: string; // Add name property
  type: 'browser' | 'session';
  port?: number;
  status?: string;
  debug_port?: number;
}

export type { BrowserSession };

export interface Task {
  id: string;
  name: string;
  color: string;
  status: "pending" | "in_process" | "done" | "error";
  workflow_id: string | null;
  servers: string[];
  browser_sessions: BrowserSession[];
  start_time: string | null;
  run_immediately: boolean;
  repeat_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  category?: string | null;
}
