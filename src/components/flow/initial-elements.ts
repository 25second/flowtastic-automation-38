
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'custom',
    position: { x: 250, y: 5 },
    data: { label: 'Start' }
  }
];

export const initialEdges: Edge[] = [];
