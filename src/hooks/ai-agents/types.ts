
export interface Agent {
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
}
