
import { Node, Edge } from '@xyflow/react';
import { Json } from '@/integrations/supabase/types';
import { NodeData } from '@/types/workflow';

export const serializeWorkflowData = (nodes: Node<NodeData>[], edges: Edge[]): { nodes: Json; edges: Json } => {
  const serializedNodes = nodes.map(node => ({
    id: node.id,
    position: node.position,
    data: node.data,
    type: node.type
  }));

  const serializedEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type
  }));

  return {
    nodes: serializedNodes as unknown as Json,
    edges: serializedEdges as unknown as Json,
  };
};

export const deserializeWorkflowData = (nodes: Json, edges: Json): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const parseNodes = (input: Json): Node<NodeData>[] => {
    if (!Array.isArray(input)) return [];
    return input.map((node: any) => ({
      id: String(node?.id ?? ''),
      position: {
        x: Number(node?.position?.x ?? 0),
        y: Number(node?.position?.y ?? 0)
      },
      data: {
        label: String(node?.data?.label ?? 'Node'),
        description: node?.data?.description,
        ...node?.data
      },
      type: String(node?.type ?? 'custom')
    }));
  };

  const parseEdges = (input: Json): Edge[] => {
    if (!Array.isArray(input)) return [];
    return input.map((edge: any) => ({
      id: String(edge?.id ?? ''),
      source: String(edge?.source ?? ''),
      target: String(edge?.target ?? ''),
      type: String(edge?.type ?? 'default')
    }));
  };

  return {
    nodes: parseNodes(nodes),
    edges: parseEdges(edges)
  };
};
