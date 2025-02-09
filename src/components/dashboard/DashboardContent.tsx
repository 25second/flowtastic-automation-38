
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { Node, Edge } from '@xyflow/react';

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
    navigate('/', { 
      state: { 
        workflow: {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          nodes: workflow.nodes,
          edges: workflow.edges,
          tags: workflow.tags || []
        } 
      }
    });
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
      <h2 className="text-2xl font-semibold mb-4">Your Workflows</h2>
      <WorkflowList
        workflows={workflows}
        isLoading={isLoading}
        onDelete={handleDeleteWorkflows}
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
