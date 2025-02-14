
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
    console.log('Browser type:', typeof selectedBrowser);
    console.log('Is null?', selectedBrowser === null);
    console.log('Has debug_port?', selectedBrowser?.debug_port);
    console.log('Full selectedBrowser object:', JSON.stringify(selectedBrowser, null, 2));
    console.log('Browsers:', browsers);
    console.log('Selected Workflow:', selectedWorkflow);

    // Проверяем, что selectedBrowser существует и не является null
    if (!selectedBrowser) {
      console.log('No browser selected (null check), showing error');
      toast.error('Пожалуйста, выберите браузер или сессию');
      return;
    }

    if (onConfirm) {
      console.log('Using onConfirm callback');
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
      console.log('No workflow selected, showing error');
      toast.error('Не выбран рабочий процесс');
      return;
    }

    try {
      let port: number;
      
      console.log('Checking browser type for port extraction');
      if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
        console.log('Browser is LinkenSphere session, full object:', selectedBrowser);
        if (!selectedBrowser.debug_port) {
          console.log('No debug port found in session');
          toast.error('Не удалось получить порт сессии');
          return;
        }
        port = selectedBrowser.debug_port;
        console.log('Using session debug port:', port);
      } else {
        console.log('Browser is regular Chrome instance');
        port = selectedBrowser as number;
        console.log('Using Chrome port:', port);
      }

      console.log('Final port value:', port);
      console.log('Starting workflow execution...');
      
      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        port
      );
      
      console.log('Workflow started successfully');
      setShowBrowserDialog(false);
      setSelectedWorkflow(null);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Не удалось запустить рабочий процесс');
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
