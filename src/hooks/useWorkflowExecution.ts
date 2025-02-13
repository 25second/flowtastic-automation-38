
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

  const handleStartWorkflow = async (browserPort?: number) => {
    try {
      if (!nodes.length) {
        toast.error('No nodes in workflow');
        return;
      }

      if (!browserPort) {
        toast.error('No browser port specified');
        return;
      }

      await startWorkflow(nodes, edges, browserPort);
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
