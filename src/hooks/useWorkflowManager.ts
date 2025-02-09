
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';

export const useWorkflowManager = (nodes: Node[], edges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
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
    mutationFn: async () => {
      if (!workflowName) {
        toast.error('Please enter a workflow name');
        return;
      }

      const { data, error } = await supabase
        .from('workflows')
        .insert({
          name: workflowName,
          description: workflowDescription,
          nodes: nodes as unknown as Json,
          edges: edges as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Workflow saved successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setWorkflowName('');
      setWorkflowDescription('');
    },
    onError: (error) => {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    },
  });

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
    saveWorkflow,
    deleteWorkflow,
  };
};
