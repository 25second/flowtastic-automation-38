
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import { Database } from '@/integrations/supabase/types';

type Json = Database['public']['Tables']['workflows']['Row']['nodes'];

export const useWorkflowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const saveWorkflow = useMutation({
    mutationFn: async ({ id, nodes, edges }: { id?: string, nodes: Node[], edges: Edge[] }) => {
      const workflowData = {
        name: workflowName || 'Untitled Workflow',
        description: workflowDescription,
        nodes: nodes as unknown as Json,
        edges: edges as unknown as Json,
        tags,
      };

      let result;
      
      if (id) {
        // Update existing workflow
        const { data, error } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Workflow updated successfully');
      } else {
        if (!workflowName) {
          toast.error('Please enter a workflow name');
          return;
        }
        // Create new workflow
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Workflow saved successfully');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setWorkflowName('');
      setWorkflowDescription('');
      setTags([]);
      setShowSaveDialog(false);
    },
    onError: (error) => {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    },
  });

  const refreshWorkflows = () => {
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
  };

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Workflow deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      toast.error('Failed to delete workflow');
      console.error('Delete error:', error);
    },
  });

  return {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  };
};
