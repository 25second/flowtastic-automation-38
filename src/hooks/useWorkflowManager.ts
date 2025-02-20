import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { Category } from '@/types/workflow';

type Json = Database['public']['Tables']['workflows']['Row']['nodes'];

export const useWorkflowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  useEffect(() => {
    const addCategoryColumn = async () => {
      try {
        const { data: columnExists } = await supabase
          .rpc('column_exists', { 
            p_table_name: 'workflows',
            p_column_name: 'category'
          });

        if (!columnExists) {
          const { error } = await supabase
            .rpc('add_column_if_not_exists', {
              p_table_name: 'workflows',
              p_column_name: 'category',
              p_column_type: 'text'
            });

          if (error) {
            console.error('Error adding category column:', error);
            toast.error('Failed to add category column');
          }
        }
      } catch (error) {
        console.error('Error checking/adding category column:', error);
      }
    };

    addCategoryColumn();
  }, []);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      console.log('Fetching workflows for user:', session.user.id);
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        toast.error('Failed to load workflows');
        throw error;
      }

      console.log('Fetched workflows:', data);
      return data;
    },
    enabled: !!session?.user,
  });

  const saveWorkflow = useMutation({
    mutationFn: async ({ id, nodes, edges }: { id?: string; nodes: Node[]; edges: Edge[] }) => {
      if (!session?.user) {
        console.log('No user session found while saving');
        toast.error('Please sign in to save workflows');
        return null;
      }

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes as unknown as Json,
        edges: edges as unknown as Json,
        tags,
        category: category?.id || null,
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
      setCategory(null);
      setShowSaveDialog(false);
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
    category,
    setCategory,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  };
};
