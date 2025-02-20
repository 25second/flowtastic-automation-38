
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';

export const hasValidNodeStructure = (node: unknown): node is FlowNodeWithData => {
  const n = node as any;
  return (
    n &&
    typeof n.id === 'string' &&
    typeof n.position === 'object' &&
    typeof n.position.x === 'number' &&
    typeof n.position.y === 'number' &&
    typeof n.data === 'object' &&
    typeof n.data.label === 'string'
  );
};

export const hasValidEdgeStructure = (edge: unknown): edge is Edge => {
  const e = edge as any;
  return (
    e &&
    typeof e.id === 'string' &&
    typeof e.source === 'string' &&
    typeof e.target === 'string'
  );
};

export const validateWorkflowData = (rawNodes: any[], rawEdges: any[]) => {
  const nodes: FlowNodeWithData[] = [];
  const edges: Edge[] = [];

  for (const rawNode of rawNodes) {
    if (hasValidNodeStructure(rawNode)) {
      nodes.push(rawNode);
    } else {
      console.warn('Invalid node structure:', rawNode);
    }
  }
  
  for (const rawEdge of rawEdges) {
    if (hasValidEdgeStructure(rawEdge)) {
      edges.push(rawEdge);
    } else {
      console.warn('Invalid edge structure:', rawEdge);
    }
  }

  return { nodes, edges };
};
