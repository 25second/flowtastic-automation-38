
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';

interface WorkflowActionsProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
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
  saveWorkflow,
  editingWorkflow,
  setEditingWorkflow,
  showEditDialog,
  setShowEditDialog,
}: WorkflowActionsProps) {
  const navigate = useNavigate();
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);

  const handleCreateNewWorkflow = () => {
    setShowNewWorkflowDialog(true);
  };

  const handleSaveNewWorkflow = () => {
    saveWorkflow.mutate(
      { nodes: [], edges: [] },
      {
        onSuccess: (savedWorkflow: any) => {
          setShowNewWorkflowDialog(false);
          navigate('/', { 
            state: { 
              workflow: {
                id: savedWorkflow.id,
                name: workflowName,
                description: workflowDescription,
                nodes: [],
                edges: [],
                tags: tags
              } 
            } 
          });
          setWorkflowName('');
          setWorkflowDescription('');
          setTags([]);
        }
      }
    );
  };

  const handleSaveEdit = async () => {
    if (!editingWorkflow) return;

    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          name: workflowName,
          description: workflowDescription,
          tags: tags
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
      />
    </>
  );
}
