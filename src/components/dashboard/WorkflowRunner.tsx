
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';
import { Server } from '@/types/server';
import { toast } from 'sonner';

interface WorkflowRunnerProps {
  selectedWorkflow: any;
  setSelectedWorkflow: (workflow: any) => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  onConfirm?: () => Promise<void>;
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
    setSelectedServer,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    startWorkflow,
    servers,
  } = useServerState();

  const handleConfirmRun = async () => {
    if (onConfirm) {
      await onConfirm();
      return;
    }

    if (!selectedWorkflow) {
      toast.error('No workflow selected');
      return;
    }

    if (!selectedBrowser) {
      toast.error('Please select a browser');
      return;
    }

    // После проверки на null, мы можем быть уверены, что selectedBrowser существует
    if (typeof selectedBrowser === 'object') {
      // Теперь можем безопасно проверить наличие свойства status
      if ('status' in selectedBrowser) {
        const session = selectedBrowser as any;
        
        if (session.status !== 'running') {
          toast.error('Please start the Linken Sphere session first');
          return;
        }

        if (!session.debug_port) {
          toast.error('No debug port available for the session');
          return;
        }

        try {
          await startWorkflow(
            selectedWorkflow.nodes,
            selectedWorkflow.edges,
            session.debug_port
          );
          
          setShowBrowserDialog(false);
          setSelectedWorkflow(null);
        } catch (error) {
          console.error('Error starting workflow:', error);
          toast.error('Failed to start workflow');
        }
        return;
      }
    }

    // Для обычного Chrome браузера
    const browserPort = selectedBrowser as number;
    
    try {
      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        browserPort
      );
      
      setShowBrowserDialog(false);
      setSelectedWorkflow(null);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Failed to start workflow');
    }
  };

  // Transform servers data into format expected by WorkflowRunDialog
  const serverOptions = servers.map((server: Server) => ({
    id: server.id,
    label: server.name || server.url,
    value: server.id
  }));

  return (
    <WorkflowRunDialog
      showBrowserDialog={showBrowserDialog}
      setShowBrowserDialog={setShowBrowserDialog}
      servers={serverOptions}
      selectedServer={selectedServer}
      setSelectedServer={setSelectedServer}
      browsers={browsers}
      selectedBrowser={selectedBrowser}
      setSelectedBrowser={setSelectedBrowser}
      onConfirm={handleConfirmRun}
    />
  );
}
