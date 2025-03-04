
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import { Database } from '@/integrations/supabase/types';
import { Category } from '@/types/workflow';
import { validateWorkflow } from './useWorkflowValidation';
import { Session } from '@supabase/supabase-js';
import { FlowNodeWithData } from '@/types/flow';

type Json = Database['public']['Tables']['workflows']['Row']['nodes'];

interface SaveWorkflowParams {
  id?: string;
  nodes: FlowNodeWithData[];
  edges: Edge[];
  workflowName: string;
  workflowDescription: string;
  tags: string[];
  category: Category | null;
  isFavorite?: boolean;
}

export const useWorkflowMutations = (session: Session | null) => {
  const queryClient = useQueryClient();

  const saveWorkflow = useMutation({
    mutationFn: async ({ 
      id, 
      nodes, 
      edges, 
      workflowName, 
      workflowDescription, 
      tags, 
      category,
      isFavorite 
    }: SaveWorkflowParams) => {
      if (!session?.user) {
        console.log('No user session found while saving');
        toast.error('Please sign in to save workflows');
        return null;
      }

      try {
        validateWorkflow(nodes as Node[]);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        throw error;
      }

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes as unknown as Json,
        edges: edges as unknown as Json,
        tags,
        category: category?.id || null,
        user_id: session.user.id,
        ...(isFavorite !== undefined && { is_favorite: isFavorite }),
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
      queryClient.invalidateQueries({ queryKey: ['favorited-workflows'] });
    },
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) {
        console.log('No user session found while deleting');
        toast.error('Please sign in to delete workflows');
        return;
      }

      console.log('Deleting workflow:', id);
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting workflow:', error);
        toast.error('Failed to delete workflow');
        throw error;
      }
      toast.success('Workflow deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  return { 
    saveWorkflow,
    deleteWorkflow
  };
};
