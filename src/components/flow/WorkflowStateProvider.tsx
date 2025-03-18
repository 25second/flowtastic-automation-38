import React, { createContext, useContext, useState } from 'react';
import { Edge } from '@xyflow/react';
import { Category } from '@/types/workflow';
import { FlowNodeWithData } from '@/types/flow';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useWorkflowCategories } from '@/hooks/workflow/useWorkflowCategories';

interface WorkflowStateContextType {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  showScript: boolean;
  setShowScript: (show: boolean) => void;
  resetFlow: () => void;
  versions: any[];
  showVersions: boolean;
  setShowVersions: (show: boolean) => void;
  restoreVersion: (version: any) => void;
  setNodes: React.Dispatch<React.SetStateAction<FlowNodeWithData[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  saveWorkflow: (data: {
    id?: string;
    nodes: FlowNodeWithData[];
    edges: Edge[];
    workflowName: string;
    workflowDescription: string;
    tags: string[];
    category: Category | null;
  }) => void;
  existingWorkflow: any;
  categories: Category[];
}

// Create context with a default value
const WorkflowStateContext = createContext<WorkflowStateContextType | undefined>(undefined);

// Custom hook to use the context
export const useWorkflowState = () => {
  const context = useContext(WorkflowStateContext);
  if (!context) {
    throw new Error('useWorkflowState must be used within a WorkflowStateProvider');
  }
  return context;
};

export const WorkflowStateProvider: React.FC<{
  children: (context: WorkflowStateContextType) => React.ReactNode;
}> = ({ children }) => {
  // Get state from hooks
  const flowState = useFlowState();
  const { categories: workflowCategories, loading: categoriesLoading } = useWorkflowCategories();
  
  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    category,
    setCategory,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow: workflowMutation,
    refreshWorkflows,
    workflows,
  } = useWorkflowManager(flowState.nodes, flowState.edges);

  // Extract workflow from location state if available
  const existingWorkflow = workflows?.find((workflow: any) => workflow.id === window.location.pathname.split('/').pop());

  const handleSaveWorkflow = (data: { 
    id?: string; 
    nodes: FlowNodeWithData[]; 
    edges: Edge[];
    workflowName: string;
    workflowDescription: string;
    tags: string[];
    category: Category | null;
  }) => {
    workflowMutation.mutate({
      ...data,
      workflowName: data.workflowName,
      workflowDescription: data.workflowDescription,
      tags: data.tags,
      category: data.category
    });
  };

  const value: WorkflowStateContextType = {
    ...flowState,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    category,
    setCategory,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow: handleSaveWorkflow,
    existingWorkflow,
    categories: workflowCategories || []
  };

  return (
    <WorkflowStateContext.Provider value={value}>
      {children(value)}
    </WorkflowStateContext.Provider>
  );
};
