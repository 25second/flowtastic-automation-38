
import { useState } from 'react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

export const useRecording = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
  startRecording: () => void,
  stopRecording: () => Promise<FlowNodeWithData[]>
) => {
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordClick = async () => {
    try {
      if (isRecording) {
        const recordedNodes = await stopRecording();
        if (recordedNodes) {
          setNodes([...nodes, ...recordedNodes]);
          toast.success('Recording added to workflow');
        }
        setIsRecording(false);
        setShowRecordDialog(false);
      } else {
        startRecording();
        setIsRecording(true);
        setShowRecordDialog(false);
      }
    } catch (error) {
      console.error('Error handling recording:', error);
      toast.error('Failed to handle recording');
    }
  };

  return {
    showRecordDialog,
    setShowRecordDialog,
    isRecording,
    handleRecordClick,
  };
};
