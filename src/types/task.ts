
interface BrowserSession {
  id: string;
  type: 'browser' | 'session';
  port?: number;
  status?: string;
}

export type { BrowserSession };  // Add this export

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
