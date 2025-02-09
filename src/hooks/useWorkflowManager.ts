
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
    queryKey: ['workflows', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)  // Filter by user_id
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
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

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes as unknown as Json,
        edges: edges as unknown as Json,
        tags,
        user_id: session.user.id,
      };

      console.log('Saving workflow with data:', workflowData);

      if (id) {
        const { data, error } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating workflow:', error);
          toast.error('Failed to update workflow');
          throw error;
        }
        toast.success('Workflow updated successfully');
        return data;
      } else {
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) {
          console.error('Error saving workflow:', error);
          toast.error('Failed to save workflow');
          throw error;
        }
        toast.success('Workflow saved successfully');
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setWorkflowName('');
      setWorkflowDescription('');
      setTags([]);
      setShowSaveDialog(false);
    },
  });

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
  });

  const refreshWorkflows = () => {
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
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
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  };
};
