import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowForm } from '@/components/workflow/WorkflowForm';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';
import { useServerState } from '@/hooks/useServerState';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  
  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
    tags,
    setTags,
  } = useWorkflowManager([] as Node[], [] as Edge[]);

  const {
    servers,
    selectedServer,
    setSelectedServer,
    showServerDialog,
    setShowServerDialog,
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
        onSuccess: (savedWorkflow) => {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar onNewWorkflow={() => setShowNewWorkflowDialog(true)} />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Workflow Dashboard</h1>
            <SidebarTrigger />
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Workflows</h2>
            <WorkflowList
              workflows={workflows}
              isLoading={isLoading}
              onDelete={handleDeleteWorkflows}
            />
          </div>

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

          <BrowserSelectDialog
            open={showBrowserDialog}
            onOpenChange={setShowBrowserDialog}
            servers={servers}
            selectedServer={selectedServer}
            onServerSelect={setSelectedServer}
            browsers={browsers}
            selectedBrowser={selectedBrowser}
            onBrowserSelect={setSelectedBrowser}
            onConfirm={handleConfirmRun}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
