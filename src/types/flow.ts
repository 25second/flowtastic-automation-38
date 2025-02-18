
import { Node } from '@xyflow/react';

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  settings?: NodeSettings;
  color?: string;
  icon?: string;
}

export interface FlowNode {
  type: string;
  label: string;
  description: string;
  settings: Record<string, any>;
  color?: string;
  icon?: string;
  style: {
    background: string;
    padding: string;
    borderRadius: string;
    width: number;
  };
}

export interface NodeCategory {
  name: string;
  nodes: FlowNode[];
}

export interface NodeSettings {
  // Trigger node settings
  cronExpression?: string;
  eventType?: string;
  delay?: number;

  // Tab node settings
  url?: string;

  // Page node settings
  selector?: string;
  text?: string;
  behavior?: 'smooth' | 'auto';

  // JavaScript node settings
  code?: string;
  expression?: string;

  // Data node settings
  data?: any;
  filename?: string;
  format?: string;
  attribute?: string;

  // Flow node settings
  condition?: string;
  description?: string;
  times?: number;
  duration?: number;

  // API node settings
  headers?: string;
  params?: string;
  body?: string;
  website?: string;
  name?: string;
  what_to_click?: string;
  wait_seconds?: number;
  where?: string;
  minutes?: number;
  message?: string;
  time?: string;
  question?: string;
  if_true?: string;
  if_false?: string;
  action?: string;
}

export type FlowNodeWithData = Node<FlowNodeData>;
