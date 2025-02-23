
import { createContext, useContext, useState, ReactNode } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';

interface FlowstreamContextType {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  setNodes: (nodes: FlowNodeWithData[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectedNode: FlowNodeWithData | null;
  setSelectedNode: (node: FlowNodeWithData | null) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
}

const FlowstreamContext = createContext<FlowstreamContextType | undefined>(undefined);

export function FlowstreamProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<FlowNodeWithData[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNodeWithData | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <FlowstreamContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        selectedNode,
        setSelectedNode,
        isRunning,
        setIsRunning,
      }}
    >
      {children}
    </FlowstreamContext.Provider>
  );
}

export function useFlowstream() {
  const context = useContext(FlowstreamContext);
  if (context === undefined) {
    throw new Error('useFlowstream must be used within a FlowstreamProvider');
  }
  return context;
}
