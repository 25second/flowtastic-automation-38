
import { Node } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';

export interface NodeSettings {
  // Basic node settings
  url?: string;
  openMethod?: 'current-tab' | 'new-tab' | 'new-window';
  direction?: 'back' | 'forward';
  
  // Interaction settings
  selector?: string;
  clickType?: 'single' | 'double' | 'right';
  delay?: number;
  text?: string;
  clearBefore?: boolean;
  behavior?: 'smooth' | 'auto';
  scrollY?: number;
  
  // Mouse settings
  modifiers?: string[];
  x?: number;
  y?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  deltaX?: number;
  deltaY?: number;
  
  // Data processing settings
  dataType?: 'text' | 'html' | 'attribute';
  attribute?: string;
  format?: 'json' | 'csv' | 'txt';
  filePath?: string;
  source?: 'file' | 'api' | 'database';
  data?: any;
  filename?: string;
  
  // Flow control settings
  mode?: 'delay' | 'element';
  value?: number;
  condition?: string;
  description?: string;
  times?: number;
  duration?: number;
  
  // API settings
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: string;
  body?: string;
  waitForResponse?: boolean;
  params?: Record<string, string>;
  
  // Code settings
  code?: string;
  expression?: string;
  function?: string;
  
  // Trigger settings
  cronExpression?: string;
  eventType?: string;

  // LinkSphere settings
  useSettingsPort?: boolean;

  // Data Generation settings
  gender?: 'male' | 'female';
  nationality?: string;
  country?: string;
  emailDomain?: string;
  selectedOutputs?: string[];

  // Tab management settings
  fromIndex?: number;
  toIndex?: number;
  index?: number | 'current';
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';

  // Timer settings
  timeout?: number;
  state?: 'hidden' | 'visible' | 'networkidle' | 'domcontentloaded' | 'load';

  // Keyboard settings
  key?: string;
  shortcut?: string;

  // Table settings
  tableName?: string;
  columnName?: string;
  readMode?: 'sequential' | 'random';
  writeMode?: 'overwrite' | 'empty-cells';
  limit?: number;
  offset?: number;

  // Math operation settings
  inputs?: Array<{ id: string; label: string }>;
  outputs?: Array<{ id: string; label: string }>;
  a?: number;
  b?: number;
  max?: number;
}

export interface NodeOutput {
  id: string;
  label: string;
}

export interface FlowNode {
  type: string;
  label: string;
  description: string;
  settings: Record<string, any>;
  outputs?: NodeOutput[];
  color?: string;
  icon?: string | LucideIcon;
  isTerminal?: boolean;
  isStartScript?: boolean;
  style?: {
    background: string;
    padding: string;
    borderRadius: string;
    width: number;
  };
}

export interface BaseNodeData extends Record<string, unknown> {
  type: string;
  label: string;
  description?: string;
  settings?: NodeSettings;
  defaultSettings?: Record<string, any>;
  color?: string;
  icon?: string | LucideIcon;
  isTerminal?: boolean;
  outputs?: NodeOutput[];
}

export interface FlowNodeData extends BaseNodeData {
  [key: string]: unknown;
}

export interface NodeCategory {
  name: string;
  nodes: FlowNode[];
}

export type FlowNodeWithData = Node<FlowNodeData>;
