
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { useDragAndDrop } from './useDragAndDrop';
import { useState, useCallback } from 'react';
import { WorkflowExecutionParams } from '@/hooks/useWorkflowExecution';

export const useFlowActions = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
  edges: Edge[],
  startWorkflow: (nodes: FlowNodeWithData[], edges: Edge[], params: WorkflowExecutionParams) => Promise<void>,
  startRecording: (browserPort: number) => Promise<void>,
  stopRecording: () => Promise<FlowNodeWithData[]>
) => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  const handleStartWorkflow = useCallback(async () => {
    console.log('handleStartWorkflow called');
    setShowBrowserDialog(true);
  }, []);

  const handleRecordClick = useCallback(async () => {
    console.log('handleRecordClick called, isRecording:', isRecording);
    if (!isRecording) {
      setShowRecordDialog(true);
    } else {
      try {
        console.log('Stopping recording...');
        const recordedNodes = await stopRecording();
        console.log('Received recorded nodes:', recordedNodes);
        setNodes(recordedNodes);
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  }, [isRecording, stopRecording, setNodes]);

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
