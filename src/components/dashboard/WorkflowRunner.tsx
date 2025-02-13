
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

    // В этом случае selectedBrowser может быть либо номером порта Chrome,
    // либо объектом сессии Linken Sphere с debug_port
    const browserPort = typeof selectedBrowser === 'number' 
      ? selectedBrowser 
      : (selectedBrowser as any).debug_port;
    
    if (!browserPort) {
      toast.error('No browser port available');
      return;
    }

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
