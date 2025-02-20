import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { toast } from 'sonner';
import { WorkflowExecutionParams } from '@/hooks/workflow-execution';

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
    selectedServer,
    selectedBrowser,
    startWorkflow,
    serverToken,
  } = useServerState();

  const handleConfirmRun = async () => {
    console.log('=== WorkflowRunner.handleConfirmRun ===');
    console.log('Selected Browser:', selectedBrowser);
    console.log('Selected Server:', selectedServer);
    console.log('Selected Workflow:', selectedWorkflow);
    console.log('Server Token:', serverToken);

    if (!selectedServer) {
      toast.error('Please select a server');
      return;
    }

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
      console.log('Starting workflow with browser:', selectedBrowser);
      
      let executionParams: WorkflowExecutionParams;
      
      if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
        // For LinkenSphere sessions
        const sessionPort = selectedBrowser.debug_port;
        console.log('LinkenSphere session debug port:', sessionPort);
        
        if (!sessionPort) {
          toast.error('Selected LinkenSphere session has no debug port');
          return;
        }

        executionParams = {
          browserType: 'linkenSphere',
          browserPort: sessionPort,
          sessionId: selectedBrowser.id
        };

        console.log('Using LinkenSphere session port:', sessionPort);
      } else if (typeof selectedBrowser === 'number') {
        // For Chrome browser
        executionParams = {
          browserType: 'chrome',
          browserPort: selectedBrowser
        };
        console.log('Using Chrome browser port:', selectedBrowser);
      } else {
        toast.error('Invalid browser selection');
        return;
      }

      console.log('Final execution params:', executionParams);
      
      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        executionParams
      );
      
      setShowBrowserDialog(false);
      setSelectedWorkflow(null);
      toast.success('Workflow started successfully');
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
