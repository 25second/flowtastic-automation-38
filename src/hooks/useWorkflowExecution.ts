
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

export const useWorkflowExecution = (
  nodes: FlowNodeWithData[],
  edges: Edge[],
  startWorkflow: (nodes: FlowNodeWithData[], edges: Edge[], browser: number) => Promise<void>
) => {
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleStartWorkflow = async () => {
    try {
      if (!nodes.length) {
        toast.error('No nodes in workflow');
        return;
      }
      setShowBrowserDialog(false);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Failed to start workflow');
    }
  };

  return {
    showBrowserDialog,
    setShowBrowserDialog,
    showAIDialog,
    setShowAIDialog,
    prompt,
    setPrompt,
    handleStartWorkflow,
  };
};
