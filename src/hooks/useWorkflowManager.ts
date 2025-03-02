
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWorkflowCategories } from './workflow/useWorkflowCategories';
import { useWorkflowFetching } from './workflow/useWorkflowFetching';
import { useWorkflowMutations } from './workflow/useWorkflowMutations';

export const useWorkflowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { session } = useAuth();

  // Initialize category column if needed
  useWorkflowCategories();

  // Fetch workflows
  const { workflows, isLoading, refreshWorkflows } = useWorkflowFetching(session);

  // Set up mutations
  const { saveWorkflow, deleteWorkflow } = useWorkflowMutations(session);

  // Wrapper function to pass all the state to the mutation
  const handleSaveWorkflow = ({ id, nodes, edges }: { id?: string; nodes: Node[]; edges: Edge[] }) => {
    return saveWorkflow.mutate({
      id,
      nodes,
      edges,
      workflowName,
      workflowDescription,
      tags,
      category
    }, {
      onSuccess: () => {
        setWorkflowName('');
        setWorkflowDescription('');
        setTags([]);
        setCategory(null);
        setShowSaveDialog(false);
      }
    });
  };

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
    saveWorkflow: handleSaveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  };
};
