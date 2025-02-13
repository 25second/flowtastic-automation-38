
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { useDragAndDrop } from './useDragAndDrop';
import { useRecording } from './useRecording';
import { useWorkflowExecution } from './useWorkflowExecution';

export const useFlowActions = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
  edges: Edge[],
  startWorkflow: (nodes: FlowNodeWithData[], edges: Edge[], browserPort: number) => Promise<void>,
  startRecording: (browserPort: number) => Promise<void>,
  stopRecording: () => Promise<FlowNodeWithData[]>
) => {
  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  const {
    showRecordDialog,
    setShowRecordDialog,
    isRecording,
    handleRecordClick,
  } = useRecording(nodes, setNodes, (browserPort: number) => startRecording(browserPort), stopRecording);

  const {
    showBrowserDialog,
    setShowBrowserDialog,
    showAIDialog,
    setShowAIDialog,
    prompt,
    setPrompt,
    handleStartWorkflow,
  } = useWorkflowExecution(nodes, edges, startWorkflow);

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
