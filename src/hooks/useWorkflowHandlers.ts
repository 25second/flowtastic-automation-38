
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';

export const useWorkflowHandlers = (
  nodes: Node[],
  edges: Edge[],
  handleStartWorkflow: (browserPort: number) => Promise<void>,
  handleRecordClick: () => Promise<void>
) => {
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [actionType, setActionType] = useState<'run' | 'record' | null>(null);

  const handleStartWithDialog = () => {
    setActionType('run');
    setShowBrowserDialog(true);
  };

  const handleRecordWithDialog = () => {
    setActionType('record');
    setShowBrowserDialog(true);
  };

  const handleConfirmAction = async () => {
    if (actionType === 'run') {
      await handleStartWorkflow(0); // The actual browser port will be passed from the parent
    } else if (actionType === 'record') {
      await handleRecordClick();
    }
  };

  return {
    showBrowserDialog,
    setShowBrowserDialog,
    actionType,
    handleStartWithDialog,
    handleRecordWithDialog,
    handleConfirmAction,
  };
};
