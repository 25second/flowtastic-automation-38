
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useState } from 'react';

interface WorkflowStateProviderProps {
  children: React.ReactNode;
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

  const flowState = {
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

  return (
    <>
      {children(flowState)}
    </>
  );
};
