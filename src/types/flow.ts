
import { Node, NodeProps } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';

// Make NodeSettings extend Record<string, any>
export interface NodeSettings extends Record<string, any> {
  url?: string;
  openMethod?: 'current-tab' | 'new-tab' | 'new-window';
  direction?: 'back' | 'forward';
  action?: string;
  
  selector?: string;
  clickType?: 'single' | 'double' | 'right';
  delay?: number;
  text?: string;
  clearBefore?: boolean;
  behavior?: 'smooth' | 'auto';
  scrollY?: number;
  
  modifiers?: string[];
  x?: number;
  y?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  deltaX?: number;
  deltaY?: number;
  
  dataType?: 'text' | 'html' | 'attribute';
  attribute?: string;
  format?: 'json' | 'csv' | 'txt';
  filePath?: string;
  source?: 'file' | 'api' | 'database';
  data?: any;
  filename?: string;
  
  mode?: 'delay' | 'element';
  value?: number;
  condition?: string;
  description?: string;
  times?: number;
  duration?: number;
  
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: string;
  body?: string;
  waitForResponse?: boolean;
  params?: Record<string, string>;
  
  code?: string;
  expression?: string;
  function?: string;
  
  cronExpression?: string;
  eventType?: string;
  useSettingsPort?: boolean;
  gender?: 'male' | 'female';
  nationality?: string;
  country?: string;
  emailDomain?: string;
  selectedOutputs?: string[];
  fromIndex?: number;
  toIndex?: number;
  index?: number | 'current';
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;
  state?: 'hidden' | 'visible' | 'networkidle' | 'domcontentloaded' | 'load';
  key?: string;
  shortcut?: string;
  tableName?: string;
  columnName?: string;
  readMode?: 'sequential' | 'random';
  writeMode?: 'overwrite' | 'empty-cells';
  limit?: number;
  offset?: number;
  inputs?: Array<{ id: string; label: string }>;
  outputs?: Array<{ id: string; label: string }>;
  a?: number;
  b?: number;
  max?: number;
  [key: string]: any;
}

export interface NodeOutput {
  id: string;
  label: string;
}

// This defines the shape of node data
export interface NodeData extends Record<string, unknown> {
  type: string;
  label: string;
  description?: string;
  settings?: NodeSettings;
  defaultSettings?: Record<string, any>;
  color?: string;
  icon?: string | LucideIcon;
  isTerminal?: boolean;
  outputs?: NodeOutput[];
  showFlowPoints?: boolean;
  [key: string]: unknown;
}

// This defines a complete node configuration
export interface FlowNode {
  type: string;
  label: string;
  description: string;
  settings: NodeSettings;
  outputs?: NodeOutput[];
  color?: string;
  icon?: string | LucideIcon;
  isTerminal?: boolean;
  isStartScript?: boolean;
  showFlowPoints?: boolean;
  style?: {
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

// Use Node type from @xyflow/react with our NodeData
export type FlowNodeWithData = Node<NodeData>;
