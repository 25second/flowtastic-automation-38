
import { Node, Edge } from '@xyflow/react';
import { Json } from '@/integrations/supabase/types';

export const serializeWorkflowData = (nodes: Node[], edges: Edge[]): { nodes: Json; edges: Json } => {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)) as unknown as Json,
    edges: JSON.parse(JSON.stringify(edges)) as unknown as Json,
  };
};

export const deserializeWorkflowData = (nodes: Json, edges: Json): { nodes: Node[]; edges: Edge[] } => {
  const parseNodes = (input: Json): Node[] => {
    if (!Array.isArray(input)) return [];
    return input.map(node => ({
      ...node,
      id: String(node.id),
      position: node.position || { x: 0, y: 0 },
      data: node.data || { label: 'Node' },
      type: node.type || 'custom'
    })) as Node[];
  };

  const parseEdges = (input: Json): Edge[] => {
    if (!Array.isArray(input)) return [];
    return input.map(edge => ({
      ...edge,
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target)
    })) as Edge[];
  };

  return {
    nodes: parseNodes(nodes),
    edges: parseEdges(edges)
  };
};
