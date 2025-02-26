
import { useState, useCallback, useEffect } from 'react';
import { Connection, useNodesState, useEdgesState, addEdge, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeWithData } from '@/types/flow';
import { nodeCategories } from '@/data/nodes';
import { useLocation } from 'react-router-dom';

const defaultNodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

// Find the start node configuration from nodeCategories
const startScriptNode = nodeCategories
  .find(category => category.name === "Basic")
  ?.nodes.find(node => node.type === 'start-script');

const initialNodes: FlowNodeWithData[] = [{
  id: 'start',
  type: 'start-script',
  position: { x: 100, y: 100 },
  data: {
    type: 'start-script',
    label: startScriptNode?.label || 'Start Script',
    settings: startScriptNode?.settings || {},
    defaultSettings: startScriptNode?.settings || {},
    description: startScriptNode?.description || 'Start of workflow',
    color: '#3B82F6',
    icon: 'PlayCircle'
  },
  style: defaultNodeStyle,
}];

interface WorkflowVersion {
  timestamp: number;
  nodes: FlowNodeWithData[];
  edges: Edge[];
}

const MAX_VERSIONS = 5;

// Load stored flow from localStorage or use initial state
const getInitialFlow = () => {
  const storedFlow = localStorage.getItem('workflow');
  if (storedFlow) {
    try {
      const { nodes, edges } = JSON.parse(storedFlow);
      // Ensure all nodes have their defaultSettings from nodeCategories
      const nodesWithDefaults = nodes.map((node: FlowNodeWithData) => {
        const nodeConfig = nodeCategories
          .flatMap(category => category.nodes)
          .find(n => n.type === node.type);
        
        if (nodeConfig) {
          return {
            ...node,
            data: {
              ...node.data,
              defaultSettings: nodeConfig.settings,
            }
          };
        }
        return node;
      });
      return { nodes: nodesWithDefaults, edges };
    } catch (error) {
      console.error('Error loading workflow:', error);
      return { nodes: initialNodes, edges: [] };
    }
  }
  return { nodes: initialNodes, edges: [] };
};

export const useFlowState = () => {
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;
  const initialFlow = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeWithData>(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [showScript, setShowScript] = useState(false);
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  // Function to reset the flow to initial state
  const resetFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
    localStorage.removeItem('workflow');
    setVersions([]);
    toast.success('New workflow created');
  }, [setNodes, setEdges]);

  // Save flow to localStorage and update versions whenever nodes or edges change
  useEffect(() => {
    try {
      const flow = { nodes, edges };
      localStorage.setItem('workflow', JSON.stringify(flow));

      // Add new version
      const newVersion: WorkflowVersion = {
        timestamp: Date.now(),
        nodes: [...nodes],
        edges: [...edges]
      };

      setVersions(prev => {
        const updated = [newVersion, ...prev].slice(0, MAX_VERSIONS);
        return updated;
      });

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

  const restoreVersion = useCallback((version: WorkflowVersion) => {
    setNodes(version.nodes);
    setEdges(version.edges);
    toast.success('Version restored');
    setShowVersions(false);
  }, [setNodes, setEdges]);

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
    versions,
    showVersions,
    setShowVersions,
    restoreVersion,
  };
};
