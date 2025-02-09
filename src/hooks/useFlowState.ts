
import { useState, useCallback, useEffect } from 'react';
import { Connection, useNodesState, useEdgesState, addEdge, Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { initialNodes } from '@/components/flow/nodeConfig';

// Load stored flow from localStorage or use initial state
const getInitialFlow = () => {
  const storedFlow = localStorage.getItem('workflow');
  if (storedFlow) {
    try {
      const { nodes, edges } = JSON.parse(storedFlow);
      return { nodes, edges };
    } catch (error) {
      console.error('Error loading workflow:', error);
      return { nodes: initialNodes, edges: [] };
    }
  }
  return { nodes: initialNodes, edges: [] };
};

export const useFlowState = () => {
  const initialFlow = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [showScript, setShowScript] = useState(false);

  // Save flow to localStorage whenever nodes or edges change
  useEffect(() => {
    try {
      const flow = { nodes, edges };
      localStorage.setItem('workflow', JSON.stringify(flow));
      toast.success('Workflow saved');
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
    onNodesChange,
    onEdgesChange,
    onConnect,
    showScript,
    setShowScript,
  };
};
