
import { useState } from 'react';
import { toast } from 'sonner';

export const useRecording = (serverUrl: string | null) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async (browserPort: number) => {
    if (!serverUrl) {
      toast.error('No server selected');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/start-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browserPort })
      });

      if (!response.ok) throw new Error('Failed to start recording');
      
      setIsRecording(true);
      toast.success('Recording started! Perform actions in the browser and they will be recorded.');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!serverUrl) return;

    try {
      const response = await fetch(`${serverUrl}/stop-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to stop recording');
      
      const { nodes } = await response.json();
      setIsRecording(false);
      return nodes;
    } catch (error) {
      console.error('Stop recording error:', error);
      toast.error('Failed to stop recording');
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
