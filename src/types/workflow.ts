
import { Json } from "@/integrations/supabase/types";

export interface WorkflowData {
  name: string;
  description: string;
  nodes?: Json;
  edges?: Json;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string;
  id?: string;
}

export interface Session {
  name: string;
  proxy: {
    protocol: string;
  };
  status: string;
  uuid: string;
}
