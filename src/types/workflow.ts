
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  nodes?: any;
  edges?: any;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}
