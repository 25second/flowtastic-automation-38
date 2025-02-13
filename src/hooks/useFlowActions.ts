
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { useDragAndDrop } from './useDragAndDrop';
import { toast } from 'sonner';

export const useFlowActions = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
  edges: Edge[],
  startWorkflow: (nodes: FlowNodeWithData[], edges: Edge[], browserPort: number) => Promise<void>,
  startRecording: (browserPort: number) => Promise<void>,
  stopRecording: () => Promise<FlowNodeWithData[]>
) => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  const handleRecordClick = async (browserPort: number) => {
    try {
      if (!isRecording) {
        await startRecording(browserPort);
        setIsRecording(true);
      } else {
        const recordedNodes = await stopRecording();
        setNodes(recordedNodes);
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to handle recording');
      setIsRecording(false);
    }
  };

  const handleStartWorkflow = async (browserPort: number) => {
    try {
      await startWorkflow(nodes, edges, browserPort);
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error('Failed to start workflow');
    }
  };

  return {
    showAIDialog,
    setShowAIDialog,
    showBrowserDialog,
    setShowBrowserDialog,
    showRecordDialog,
    setShowRecordDialog,
    prompt,
    setPrompt,
    isRecording,
    handleDragOver,
    handleDrop,
    handleStartWorkflow,
    handleRecordClick,
  };
};
