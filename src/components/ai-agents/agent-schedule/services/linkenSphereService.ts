
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface Session {
  name: string;
  status: string;
  uuid: string;
  id: string;
  proxy: {
    protocol: string;
    ip?: string;
    port?: string;
  };
  debug_port?: number;
}

export const fetchSessions = async (): Promise<Session[]> => {
  try {
    // Get port from localStorage
    const port = localStorage.getItem('linkenSpherePort') || '36912';
    const response = await fetch(`http://127.0.0.1:${port}/sessions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching LinkenSphere sessions:', error);
    toast.error('Failed to fetch LinkenSphere sessions');
    return [];
  }
};

export const startSession = async (id: string): Promise<void> => {
  // Placeholder for starting session
  console.log('Starting session:', id);
};

export const stopSession = async (id: string): Promise<void> => {
  // Placeholder for stopping session
  console.log('Stopping session:', id);
};

export const isSessionActive = (status: string): boolean => {
  return status === 'running' || status === 'automationRunning';
};

export const validateScheduleData = (
  taskName: string, 
  browserType: string, 
  selectedSessions: Set<string>, 
  runImmediately: boolean,
  startDate: Date | null,
  startTime: string
): string | null => {
  if (!taskName.trim()) {
    return 'Please enter a task name';
  }
  
  if (browserType === 'linkenSphere' && selectedSessions.size === 0) {
    return 'Please select at least one LinkenSphere session';
  }
  
  if (!runImmediately && (!startDate || !startTime)) {
    return 'Please select both date and time for scheduled execution';
  }
  
  return null;
};

export const formatScheduledTime = (startDate: Date, startTime: string): string => {
  const scheduledTime = new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
  return format(scheduledTime, 'PPpp');
};
