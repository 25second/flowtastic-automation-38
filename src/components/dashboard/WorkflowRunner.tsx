
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
    if (onConfirm) {
      await onConfirm();
      return;
    }

    if (!selectedWorkflow) {
      toast.error('No workflow selected');
      return;
    }

    // Приведение типа selectedBrowser к нашему объединенному типу
    const browser = selectedBrowser as BrowserType;
    
    if (browser === null) {
      toast.error('Please select a browser');
      return;
    }

    // Проверяем, является ли selectedBrowser объектом сессии
    if (typeof browser === 'object') {
      const session = browser as LinkenSphereSession;
      console.log('Current session:', session); // Добавляем лог для отладки
      
      if (session.status !== 'running') {
        toast.error('Please start the Linken Sphere session first');
        return;
      }

      if (!session.debug_port) {
        toast.error('No debug port available for the session');
        return;
      }

      try {
        console.log('Starting workflow with session port:', session.debug_port); // Добавляем лог для отладки
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

    // Для обычного Chrome браузера
    console.log('Starting workflow with browser port:', browser); // Добавляем лог для отладки
    try {
      await startWorkflow(
        selectedWorkflow.nodes,
        selectedWorkflow.edges,
        browser
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
