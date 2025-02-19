
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { useServers } from './useServers';
import { useBrowsers } from './useBrowsers';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useRecording } from './useRecording';
import { useServerRegistration } from './useServerRegistration';

interface LinkenSphereSession {
  id: string;
  status: string;
  debug_port?: number;
}

export const useServerState = () => {
  // Use localStorage to persist the state
  const [selectedServer, setSelectedServer] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedServer');
    return saved ? JSON.parse(saved) : null;
  });

  const [serverToken, setServerToken] = useState<string>(() => {
    return localStorage.getItem('serverToken') || '';
  });

  const [showServerDialog, setShowServerDialog] = useState(false);
  const [selectedBrowser, setSelectedBrowser] = useState<number | LinkenSphereSession | null>(null);

  // Update localStorage when state changes
  const handleSetSelectedServer = (server: string | null) => {
    setSelectedServer(server);
    if (server) {
      localStorage.setItem('selectedServer', JSON.stringify(server));
    } else {
      localStorage.removeItem('selectedServer');
    }
  };

  const handleSetServerToken = (token: string) => {
    setServerToken(token);
    if (token) {
      localStorage.setItem('serverToken', token);
    } else {
      localStorage.removeItem('serverToken');
    }
  };

  const handleSetSelectedBrowser = (browser: number | LinkenSphereSession | null) => {
    console.log('Setting selected browser:', browser);
    setSelectedBrowser(browser);
  };

  const { servers } = useServers();
  const { browsers, setBrowsers } = useBrowsers(selectedServer, serverToken);
  const { startWorkflow } = useWorkflowExecution(selectedServer, serverToken);
  const { startRecording, stopRecording } = useRecording(serverToken);
  const { registerServer } = useServerRegistration(
    serverToken, 
    setShowServerDialog, 
    setBrowsers, 
    handleSetSelectedBrowser
  );

  return {
    selectedServer,
    setSelectedServer: handleSetSelectedServer,
    serverToken,
    setServerToken: handleSetServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
    browsers,
    selectedBrowser,
    setSelectedBrowser: handleSetSelectedBrowser,
    startRecording,
    stopRecording,
    servers,
  };
};
