
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  saveWorkflow: any;
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  existingWorkflow: any;
}

interface WorkflowStateProviderProps {
  children: (flowState: FlowState) => React.ReactElement;
}

export const WorkflowStateProvider = ({ children }: WorkflowStateProviderProps) => {
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;
  const [category, setCategory] = useState<string>('');
  const [categories] = useState<string[]>(['Development', 'Testing', 'Production']);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetFlow,
  } = useFlowState();

  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
  } = useWorkflowManager(nodes, edges);

  useEffect(() => {
    if (existingWorkflow) {
      setNodes(existingWorkflow.nodes || []);
      setEdges(existingWorkflow.edges || []);
      setWorkflowName(existingWorkflow.name || '');
      setWorkflowDescription(existingWorkflow.description || '');
      setTags(existingWorkflow.tags || []);
      setCategory(existingWorkflow.category || '');
    } else {
      resetFlow();
    }
  }, [existingWorkflow, setNodes, setEdges, resetFlow, setWorkflowName, setWorkflowDescription, setTags]);

  const flowState: FlowState = {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    category,
    setCategory,
    categories,
    existingWorkflow
  };

  return children(flowState);
};
