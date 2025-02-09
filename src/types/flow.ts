
export interface FlowNode {
  type: string;
  label: string;
  description: string;
  settings: Record<string, any>;
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

