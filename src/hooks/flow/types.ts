
import { Edge, Node } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';

export interface WorkflowVersion {
  timestamp: number;
  nodes: FlowNodeWithData[];
  edges: Edge[];
}

export const defaultNodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

export const MAX_VERSIONS = 5;
