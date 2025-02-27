
import { useCallback } from 'react';
import { Connection, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeWithData } from '@/types/flow';
import { useLocation } from 'react-router-dom';
import { useInitialFlow } from './flow/useInitialFlow';
import { useVersions } from './flow/useVersions';
import { initialNodes } from './flow/useInitialFlow';

export const useFlowState = () => {
  const location = useLocation();
  const { getInitialFlow } = useInitialFlow();
  const initialFlow = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeWithData>(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [showScript, setShowScript] = useState(false);

  const {
    versions,
    setVersions,
    showVersions,
    setShowVersions,
    isSignificantChange,
    saveVersion,
    restoreVersion: restoreVersionBase
  } = useVersions(nodes, edges);

  const resetFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
    localStorage.removeItem('workflow');
    localStorage.removeItem('workflow_versions');
    setVersions([]);
    toast.success('New workflow created');
  }, [setNodes, setEdges, setVersions]);

  const wrappedOnNodesChange = useCallback((changes: NodeChange<FlowNodeWithData>[]) => {
    onNodesChange(changes);
    if (isSignificantChange(changes)) {
      saveVersion();
    }
  }, [onNodesChange, isSignificantChange, saveVersion]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself");
        return;
      }
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        saveVersion();
        return newEdges;
      });
      toast.success('Nodes connected');
    },
    [setEdges, saveVersion]
  );

  const restoreVersion = useCallback((version: WorkflowVersion) => {
    const restoredVersion = restoreVersionBase(version);
    if (restoredVersion) {
      setNodes(restoredVersion.nodes);
      setEdges(restoredVersion.edges);
    }
  }, [setNodes, setEdges, restoreVersionBase]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange: wrappedOnNodesChange,
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
