
export interface Agent {
  id: string;
  name: string;
  description: string | null;
  status: 'idle' | 'running' | 'completed' | 'error';
  category_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}
