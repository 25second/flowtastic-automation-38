
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

export interface WorkflowSession {
  name: string;
  proxy: {
    protocol: string;
  };
  status: string;
  uuid: string;
}

export interface WorkflowFormProps {
  workflowName: string;
  workflowDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  isEditing: boolean;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}
