
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { useState } from 'react';

interface WorkflowProviderProps {
  children: React.ReactNode;
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const WorkflowProvider = ({
  children,
  nodes,
  edges,
  setNodes,
  setEdges,
}: WorkflowProviderProps) => {
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;
  const { resetFlow } = useFlowState();

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

  const [category, setCategory] = useState<string>('');
  const [categories] = useState<string[]>(['Development', 'Testing', 'Production']);

  useEffect(() => {
    console.log('Loading workflow:', existingWorkflow);
    if (existingWorkflow) {
      setNodes(existingWorkflow.nodes || []);
      setEdges(existingWorkflow.edges || []);
    } else {
      resetFlow();
    }
  }, [existingWorkflow, setNodes, setEdges, resetFlow]);

  useEffect(() => {
    if (existingWorkflow) {
      setWorkflowName(existingWorkflow.name || '');
      setWorkflowDescription(existingWorkflow.description || '');
      setTags(existingWorkflow.tags || []);
      setCategory(existingWorkflow.category || '');
    }
  }, [existingWorkflow, setWorkflowName, setWorkflowDescription, setTags]);

  return (
    <>
      {children}
    </>
  );
};
