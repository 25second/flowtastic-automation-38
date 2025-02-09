
import { useState } from 'react';
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { useServerState } from '@/hooks/useServerState';

interface WorkflowRunnerProps {
  selectedWorkflow: any;
  setSelectedWorkflow: (workflow: any) => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
}

export function WorkflowRunner({
  selectedWorkflow,
  setSelectedWorkflow,
  showBrowserDialog,
  setShowBrowserDialog,
}: WorkflowRunnerProps) {
  const {
    servers,
    selectedServer,
    setSelectedServer,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    startWorkflow,
  } = useServerState();

  const handleConfirmRun = async () => {
    if (!selectedWorkflow || !selectedBrowser) return;
    
    await startWorkflow(
      selectedWorkflow.nodes,
      selectedWorkflow.edges,
      selectedBrowser
    );
    
    setShowBrowserDialog(false);
    setSelectedWorkflow(null);
  };

  return (
    <WorkflowRunDialog
      showBrowserDialog={showBrowserDialog}
      setShowBrowserDialog={setShowBrowserDialog}
      servers={servers}
      selectedServer={selectedServer}
      setSelectedServer={setSelectedServer}
      browsers={browsers}
      selectedBrowser={selectedBrowser}
      setSelectedBrowser={setSelectedBrowser}
      onConfirm={handleConfirmRun}
    />
  );
}
