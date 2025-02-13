
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

export const useRecording = (serverToken: string) => {
  const startRecording = async (browserPort: number) => {
    try {
      const response = await fetch(`${API_URL}/record/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ browserPort }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Recording start failed: ${errorData.message || response.statusText}`);
        return;
      }

      toast.success('Recording started successfully');
    } catch (error) {
      console.error('Recording start error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async (): Promise<FlowNodeWithData[]> => {
    try {
      const response = await fetch(`${API_URL}/record/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Recording stop failed: ${errorData.message || response.statusText}`);
        return [];
      }

      const data = await response.json();
      toast.success('Recording stopped successfully');
      return data.nodes;
    } catch (error) {
      console.error('Recording stop error:', error);
      toast.error('Failed to stop recording');
      return [];
    }
  };

  return { startRecording, stopRecording };
};
