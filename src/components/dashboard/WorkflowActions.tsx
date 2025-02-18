
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types/workflow';

interface WorkflowActionsProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  categories: Category[];
  saveWorkflow: any;
  editingWorkflow: any;
  setEditingWorkflow: (workflow: any) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
}

export function WorkflowActions({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
  categories,
  saveWorkflow,
  editingWorkflow,
  setEditingWorkflow,
  showEditDialog,
  setShowEditDialog,
}: WorkflowActionsProps) {
  const navigate = useNavigate();
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const handleCreateWorkflow = async () => {
    if (!session?.user) {
      toast.error('Please sign in to create workflows');
      return;
    }
    setShowNewWorkflowDialog(true);
  };

  const handleSaveNewWorkflow = async () => {
    if (!session?.user) {
      toast.error('Please sign in to create workflows');
      return;
    }

    try {
      const workflowData = {
        nodes: [],
        edges: [],
        name: workflowName,
        description: workflowDescription,
        tags: tags,
        category: category?.id || null,
        user_id: session?.user.id
      };

      const { data: newWorkflow, error } = await supabase
        .from('workflows')
        .insert(workflowData)
        .select()
        .single();

      if (error) throw error;

      setShowNewWorkflowDialog(false);
      toast.success('New workflow created successfully');
      
      navigate('/canvas', { 
        state: { 
          workflow: newWorkflow
        } 
      });
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast.error('Failed to create workflow');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingWorkflow) return;

    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          name: workflowName,
          description: workflowDescription,
          tags: tags,
          category: category?.id || null
        })
        .eq('id', editingWorkflow.id);

      if (error) throw error;

      toast.success('Workflow details updated successfully');
      setShowEditDialog(false);
      setEditingWorkflow(null);
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast.error('Failed to update workflow');
    }
  };

  return (
    <>
      <Button onClick={handleCreateWorkflow} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Workflow
      </Button>

      <SaveWorkflowDialog
        open={showNewWorkflowDialog}
        onOpenChange={setShowNewWorkflowDialog}
        nodes={[]}
        edges={[]}
        onSave={handleSaveNewWorkflow}
      />

      <SaveWorkflowDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        nodes={editingWorkflow?.nodes || []}
        edges={editingWorkflow?.edges || []}
        onSave={handleSaveEdit}
      />
    </>
  );
}
