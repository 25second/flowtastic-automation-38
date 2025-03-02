
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWorkflowFetching } from './workflow/useWorkflowFetching';
import { useWorkflowMutations } from './workflow/useWorkflowMutations';

export const useWorkflowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { session } = useAuth();

  // Fetch workflows
  const { workflows, isLoading, refreshWorkflows } = useWorkflowFetching(session);

  // Set up mutations
  const { saveWorkflow, deleteWorkflow } = useWorkflowMutations(session);

  return {
    workflows,
    isLoading,
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
    saveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  };
};
