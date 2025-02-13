
import { Node, Edge } from '@xyflow/react';
import { Json } from '@/integrations/supabase/types';

export const serializeWorkflowData = (nodes: Node[], edges: Edge[]): { nodes: Json; edges: Json } => {
  return {
    nodes: nodes as Json,
    edges: edges as Json,
  };
};

export const deserializeWorkflowData = (nodes: Json, edges: Json): { nodes: Node[]; edges: Edge[] } => {
  return {
    nodes: (nodes as Node[]) || [],
    edges: (edges as Edge[]) || [],
  };
};
