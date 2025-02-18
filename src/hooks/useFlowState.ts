
import { useState, useCallback, useEffect } from 'react';
import { Connection, useNodesState, useEdgesState, addEdge, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeWithData } from '@/types/flow';

// Load stored flow from localStorage or use initial state
const getInitialFlow = () => {
  const storedFlow = localStorage.getItem('workflow');
  if (storedFlow) {
    try {
      const { nodes, edges } = JSON.parse(storedFlow);
      return { nodes, edges };
    } catch (error) {
      console.error('Error loading workflow:', error);
      return { nodes: [], edges: [] };
    }
  }
  return { nodes: [], edges: [] };
};

export const useFlowState = () => {
  const initialFlow = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeWithData>(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [showScript, setShowScript] = useState(false);

  // Function to reset the flow to initial state
  const resetFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem('workflow');
    toast.success('New workflow created');
  }, [setNodes, setEdges]);

  // Save flow to localStorage whenever nodes or edges change
  useEffect(() => {
    try {
      const flow = { nodes, edges };
      localStorage.setItem('workflow', JSON.stringify(flow));
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
      toast.success('Nodes connected');
    },
    [],
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    showScript,
    setShowScript,
    resetFlow,
  };
};
