
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthProvider';

type Json = Database['public']['Tables']['workflows']['Row']['nodes'];

export const useWorkflowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load workflows');
        throw error;
      }
      return data;
    },
    enabled: !!session?.user,
  });

  const saveWorkflow = useMutation({
    mutationFn: async ({ id, nodes, edges }: { id?: string; nodes: Node[]; edges: Edge[] }) => {
      if (!session?.user) {
        toast.error('Please sign in to save workflows');
        return null;
      }

      if (!workflowName) {
        toast.error('Please enter a workflow name');
        return null;
      }

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes as unknown as Json,
        edges: edges as unknown as Json,
        tags,
        user_id: session.user.id,
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

        if (error) {
          toast.error('Failed to update workflow');
          throw error;
        }
        result = data;
        toast.success('Workflow updated successfully');
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) {
          toast.error('Failed to save workflow');
          throw error;
        }
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
      console.error('Save error:', error);
    },
  });

  const refreshWorkflows = () => {
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
  };

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) {
        toast.error('Please sign in to delete workflows');
        return;
      }

      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete workflow');
        throw error;
      }
      toast.success('Workflow deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
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
