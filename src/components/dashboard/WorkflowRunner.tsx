
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

interface LinkenSphereSession {
  id: string;
  status: string;
  debug_port?: number;
}

type BrowserType = number | LinkenSphereSession | null;

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
    console.log('handleConfirmRun - Current state:', {
      selectedBrowser,
      browsers,
      selectedServer
    });

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
      // Если selectedBrowser это объект (сессия), используем его debug_port
      // В противном случае используем сам selectedBrowser как порт
      const port = typeof selectedBrowser === 'object' ? selectedBrowser.debug_port! : selectedBrowser;
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
      toast.error('Failed to start workflow');
    }
  };

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
