
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  
  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
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

  const handleCreateNew = () => {
    navigate('/', { state: { workflow: null } });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflow Dashboard</h1>
        <Button 
          onClick={handleCreateNew} 
          className="bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Workflows</h2>
        <div className="grid gap-4">
          {workflows?.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 border rounded-lg flex items-center justify-between bg-white shadow-sm"
            >
              <div>
                <h3 className="font-medium text-lg">{workflow.name}</h3>
                {workflow.description && (
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                )}
                {workflow.tags && workflow.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {workflow.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleRunWorkflow(workflow)}
                >
                  Run
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleEdit(workflow)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => deleteWorkflow.mutate(workflow.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-center py-4">Loading workflows...</div>
          )}
          
          {!isLoading && workflows?.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No workflows found. Create your first workflow!
            </div>
          )}
        </div>
      </div>

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
  );
}
