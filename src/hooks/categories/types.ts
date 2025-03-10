
import { Database } from "@/integrations/supabase/types";

// Define valid category table names
export type CategoryTableName = 
  | "workflow_categories" 
  | "table_categories" 
  | "agent_categories" 
  | "task_categories";

// Define a common Category type
export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  color?: string;
  description?: string;
}
