
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { useServers } from './useServers';
import { useBrowsers } from './useBrowsers';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useRecording } from './useRecording';
import { useServerRegistration } from './useServerRegistration';

export const useServerState = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [serverToken, setServerToken] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);

  const { servers } = useServers();
  const { browsers, selectedBrowser, setSelectedBrowser, setBrowsers } = useBrowsers(selectedServer, serverToken);
  const { startWorkflow } = useWorkflowExecution(selectedServer, serverToken);
  const { startRecording, stopRecording } = useRecording(serverToken);
  const { registerServer } = useServerRegistration(serverToken, setShowServerDialog, setBrowsers, setSelectedBrowser);

  return {
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
    startRecording,
    stopRecording,
    servers,
  };
};
