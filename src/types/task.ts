
export interface Task {
  id: string;
  name: string;
  color: string;
  status: "pending" | "in_process" | "done" | "error";
  workflow_id: string | null;
  servers: string[];
  browser_sessions: {
    id: string;
    type: 'browser' | 'session';
    port?: number;
    status?: string;
  }[];
  start_time: Date | null;
  run_immediately: boolean;
  repeat_count: number;
  startTime: Date;
  endTime: Date | null;
}
