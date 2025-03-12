
export interface Agent {
  id: string;
  name: string;
  description?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  created_at: string;
  updated_at?: string;
  category_id?: string;
  user_id?: string;
  is_favorite?: boolean;
  color?: string;
  task_description?: string;
  take_screenshots?: boolean;
  script?: string;
}

export type AgentCategory = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
};
