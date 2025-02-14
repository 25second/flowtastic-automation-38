
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { toast } from 'sonner';
import { WorkflowExecutionParams } from '@/hooks/useWorkflowExecution';

interface WorkflowRunnerProps {
  selectedWorkflow: any;
  setSelectedWorkflow: (workflow: any) => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  onConfirm?: () => Promise<void>;
}

interface LinkenSphereSession {
  id: string;
  status: string;
  debug_port?: number;
}

export function WorkflowRunner({
  selectedWorkflow,
  setSelectedWorkflow,
  showBrowserDialog,
  setShowBrowserDialog,
  onConfirm,
}: WorkflowRunnerProps) {
  const {
    browsers,
    selectedBrowser,
    startWorkflow,
  } = useServerState();

  const handleConfirmRun = async () => {
    console.log('=== WorkflowRunner.handleConfirmRun ===');
    console.log('Selected Browser:', selectedBrowser);
    console.log('Selected Workflow:', selectedWorkflow);

    if (!selectedBrowser) {
      toast.error('Please select a browser or session');
      return;
    }

    if (onConfirm) {
      try {
        await onConfirm();
        setShowBrowserDialog(false);
        setSelectedWorkflow(null);
      } catch (error) {
        console.error('Error during workflow execution:', error);
        toast.error('Failed to execute workflow');
      }
      return;
    }

    if (!selectedWorkflow) {
      toast.error('No workflow selected');
      return;
    }

    try {
      const executionParams: WorkflowExecutionParams = 
        typeof selectedBrowser === 'object' && selectedBrowser !== null
          ? {
              browserType: 'linkenSphere',
              browserPort: selectedBrowser.debug_port || 0,
              sessionId: selectedBrowser.id
            }
          : {
              browserType: 'chrome',
              browserPort: selectedBrowser as number
            };

      if (executionParams.browserPort === 0) {
        toast.error('Invalid browser port');
        return;
      }

      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        executionParams
      );
      
      setShowBrowserDialog(false);
      setSelectedWorkflow(null);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Failed to start workflow');
    }
  };

  return (
    <WorkflowRunDialog
      showBrowserDialog={showBrowserDialog}
      setShowBrowserDialog={setShowBrowserDialog}
      onConfirm={handleConfirmRun}
      isForRecording={false}
    />
  );
}
