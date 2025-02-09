
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import { Database } from '@/integrations/supabase/types';

type Json = Database['public']['Tables']['workflows']['Row']['nodes'];

export const useWorkflowManager = (nodes: Node[], edges: Edge[]) => {
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
          tags,
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
      setTags([]);
      setShowSaveDialog(false);
    },
    onError: (error) => {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    },
  });

  const updateWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      if (!workflowName) {
        toast.error('Please enter a workflow name');
        return;
      }

      const { data, error } = await supabase
        .from('workflows')
        .update({
          name: workflowName,
          description: workflowDescription,
          nodes: nodes as unknown as Json,
          edges: edges as unknown as Json,
          tags,
        })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) throw error;
      toast.success('Workflow updated successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setShowSaveDialog(false);
    },
    onError: (error) => {
      toast.error('Failed to update workflow');
      console.error('Update error:', error);
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
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
};
