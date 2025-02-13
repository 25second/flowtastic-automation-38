
import { Node, Edge } from '@xyflow/react';
import { Json } from '@/integrations/supabase/types';

export const serializeWorkflowData = (nodes: Node[], edges: Edge[]): { nodes: Json; edges: Json } => {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)) as Json,
    edges: JSON.parse(JSON.stringify(edges)) as Json,
  };
};

export const deserializeWorkflowData = (nodes: Json, edges: Json): { nodes: Node[]; edges: Edge[] } => {
  return {
    nodes: (Array.isArray(nodes) ? nodes : []) as Node[],
    edges: (Array.isArray(edges) ? edges : []) as Edge[],
  };
};
