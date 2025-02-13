
import { CustomNode } from './CustomNode';
import { NodeTypes } from '@xyflow/react';
import { NodeData } from '@/types/workflow';

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
} as const;
