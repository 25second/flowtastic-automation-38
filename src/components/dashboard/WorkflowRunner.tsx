
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
    console.log('handleConfirmRun - Current state:', {
      selectedBrowser,
      browsers,
      selectedWorkflow
    });

    if (!selectedBrowser && selectedBrowser !== 0) {
      toast.error('Пожалуйста, выберите браузер или сессию');
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
      toast.error('Не выбран рабочий процесс');
      return;
    }

    try {
      // На этом этапе мы уверены, что selectedBrowser не null, так как проверили выше
      const browser = selectedBrowser as (number | LinkenSphereSession);
      let port: number;
      
      if (typeof browser === 'object' && 'debug_port' in browser) {
        port = browser.debug_port ?? 0;
      } else {
        port = browser as number;
      }

      if (port === undefined || (port === 0 && typeof browser === 'object')) {
        toast.error('Не удалось получить порт браузера');
        return;
      }

      console.log('Starting workflow with port:', port);
      
      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        port
      );
      
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
