
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { Node, Edge } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DashboardContentProps {
  workflows: any[] | undefined;
  isLoading: boolean;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  saveWorkflow: any;
  deleteWorkflow: any;
}

export function DashboardContent({
  workflows,
  isLoading,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  saveWorkflow,
  deleteWorkflow,
}: DashboardContentProps) {
  const navigate = useNavigate();
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {
    servers,
    selectedServer,
    setSelectedServer,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    startWorkflow,
  } = useServerState();

  const handleRunWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowBrowserDialog(true);
  };

  const handleConfirmRun = async () => {
    if (!selectedWorkflow || !selectedBrowser) return;
    
    await startWorkflow(
      selectedWorkflow.nodes,
      selectedWorkflow.edges,
      selectedBrowser
    );
    
    setShowBrowserDialog(false);
    setSelectedWorkflow(null);
  };

  const handleEdit = (workflow: any) => {
    setEditingWorkflow(workflow);
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description || '');
    setTags(workflow.tags || []);
    setShowEditDialog(true);
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

      toast.success('Workflow updated successfully');
      setShowEditDialog(false);
      setEditingWorkflow(null);
      // Refresh the workflows list
      saveWorkflow.invalidate();
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast.error('Failed to update workflow');
    }
  };

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

  const handleDeleteWorkflows = (ids: string[]) => {
    ids.forEach(id => deleteWorkflow.mutate(id));
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Workflows</h2>
        <Button onClick={handleCreateNewWorkflow} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <WorkflowList
        workflows={workflows}
        isLoading={isLoading}
        onDelete={handleDeleteWorkflows}
        onEdit={handleEdit}
        onRun={handleRunWorkflow}
      />

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

      <WorkflowRunDialog
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
        servers={servers}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        setSelectedBrowser={setSelectedBrowser}
        onConfirm={handleConfirmRun}
      />
    </div>
  );
}
