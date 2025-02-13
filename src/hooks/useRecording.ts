
import { useState } from 'react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

export const useRecording = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
  startRecording: (browserPort: number) => Promise<void>,
  stopRecording: () => Promise<FlowNodeWithData[]>
) => {
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordClick = async (browserPort?: number) => {
    if (!isRecording && browserPort) {
      try {
        await startRecording(browserPort);
        setIsRecording(true);
        setShowRecordDialog(false);
        toast.success('Recording started');
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast.error('Failed to start recording');
      }
    } else if (isRecording) {
      try {
        const recordedNodes = await stopRecording();
        setNodes([...nodes, ...recordedNodes]);
        setIsRecording(false);
        toast.success('Recording stopped');
      } catch (error) {
        console.error('Failed to stop recording:', error);
        toast.error('Failed to stop recording');
      }
    }
  };

  return {
    showRecordDialog,
    setShowRecordDialog,
    isRecording,
    handleRecordClick,
  };
};
