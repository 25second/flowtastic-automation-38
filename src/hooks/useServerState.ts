
import { useState, useEffect } from 'react';
import { useServerManagement } from './useServerManagement';
import { useBrowserManagement } from './useBrowserManagement';
import { useRecording } from './useRecording';
import { useWorkflowExecution } from './useWorkflowExecution';
import { toast } from 'sonner';

export const useServerState = () => {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const { servers, serverToken, setServerToken, showServerDialog, setShowServerDialog, registerServer } = useServerManagement();

  const selectedServerUrl = servers.find(s => s.id === selectedServer)?.url || null;
  
  const { browsers, selectedBrowser, setSelectedBrowser } = useBrowserManagement(selectedServerUrl);
  const { isRecording, startRecording, stopRecording } = useRecording(selectedServerUrl);
  const { startWorkflow } = useWorkflowExecution(selectedServerUrl);

  useEffect(() => {
    if (selectedServer) {
      const server = servers.find(s => s.id === selectedServer);
      if (!server?.is_active) {
        setSelectedBrowser(null);
        toast.error('Selected server is not active');
      }
    }
  }, [selectedServer, servers]);

  return {
    servers,
    selectedServer,
    setSelectedServer,
    serverToken,
    setServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    isRecording,
    startRecording,
    stopRecording,
  };
};
