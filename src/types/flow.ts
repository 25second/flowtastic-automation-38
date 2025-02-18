
import { Node } from '@xyflow/react';

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  settings?: NodeSettings;
  color?: string;
  icon?: string;
  isTerminal?: boolean;
}

export interface FlowNode {
  type: string;
  label: string;
  description: string;
  settings: Record<string, any>;
  color?: string;
  icon?: string;
  isTerminal?: boolean;
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
  
  // Data processing settings
  dataType?: 'text' | 'html' | 'attribute';
  attribute?: string;
  format?: 'json' | 'csv' | 'txt';
  filePath?: string;
  source?: 'file' | 'api' | 'database';
  
  // Flow control settings
  mode?: 'delay' | 'element';
  value?: number;
  condition?: string;
  
  // Excel settings
  sheet?: string;
  range?: string;
  
  // API settings
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: string;
  body?: string;
  waitForResponse?: boolean;
  
  // Code settings
  code?: string;

  // LinkSphere settings
  useSettingsPort?: boolean;
}

export type FlowNodeWithData = Node<FlowNodeData>;
