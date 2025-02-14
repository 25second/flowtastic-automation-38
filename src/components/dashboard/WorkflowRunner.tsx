
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { toast } from 'sonner';

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
      let port: number;
      
      if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
        if (!selectedBrowser.debug_port) {
          toast.error('No debug port found for session');
          return;
        }
        port = selectedBrowser.debug_port;
      } else {
        port = selectedBrowser as number;
      }

      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        port
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
