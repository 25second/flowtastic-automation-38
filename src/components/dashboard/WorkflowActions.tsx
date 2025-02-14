import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface WorkflowActionsProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category?: string;
  setCategory: (category: string) => void;
  categories: string[];
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

  const handleCreateWorkflow = async () => {
    if (!session?.user) {
      toast.error('Please sign in to create workflows');
      return;
    }
    setShowNewWorkflowDialog(true);
  };

  const handleSaveNewWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      const workflowData = {
        nodes: [],
        edges: [],
        name: workflowName,
        description: workflowDescription,
        tags: tags,
        category: category,
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
      
      // Reset form
      setWorkflowName('');
      setWorkflowDescription('');
      setTags([]);
      setCategory('');

      // Navigate to canvas with the new workflow
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
          category: category
        })
        .eq('id', editingWorkflow.id);

      if (error) throw error;

      toast.success('Workflow details updated successfully');
      setShowEditDialog(false);
      setEditingWorkflow(null);
      saveWorkflow.mutate({ 
        id: editingWorkflow.id, 
        nodes: editingWorkflow.nodes, 
        edges: editingWorkflow.edges 
      });
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
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={setWorkflowName}
        onDescriptionChange={setWorkflowDescription}
        onSave={handleSaveNewWorkflow}
        tags={tags}
        onTagsChange={setTags}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <SaveWorkflowDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={setWorkflowName}
        onDescriptionChange={setWorkflowDescription}
        onSave={handleSaveEdit}
        tags={tags}
        onTagsChange={setTags}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />
    </>
  );
}
