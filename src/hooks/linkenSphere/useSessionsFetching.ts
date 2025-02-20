
import { toast } from 'sonner';
import { LinkenSphereSession } from './types';

interface UseSessionsFetchingProps {
  setSessions: (sessions: LinkenSphereSession[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useSessionsFetching = ({
  setSessions,
  setLoading,
}: UseSessionsFetchingProps) => {
  const getStoredSessionPort = (sessionId: string): number | null => {
    const storedPort = localStorage.getItem(`session_${sessionId}_port`);
    return storedPort ? parseInt(storedPort, 10) : null;
  };

  const fetchSessions = async () => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    setLoading(true);

    try {
      console.group('Fetching LinkenSphere Sessions');
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch sessions:', errorData);
        
        if (errorData.timeout) {
          throw new Error('Connection timed out. Make sure LinkenSphere is running and accessible.');
        } else if (errorData.portStatus === 'closed') {
          throw new Error(`Port ${port} is not accessible. Please check if LinkenSphere is running on the correct port.`);
        } else if (errorData.details?.includes('not in use')) {
          throw new Error(`Port ${port} is not in use. Please check if LinkenSphere is running.`);
        } else {
          throw new Error(errorData.details || 'Failed to fetch sessions');
        }
      }

      const data = await response.json();
      console.log('Fetched sessions:', data);

      const updatedSessions = data.map((session: LinkenSphereSession) => {
        const storedPort = getStoredSessionPort(session.uuid);
        
        return {
          ...session,
          id: session.uuid,
          debug_port: (session.status === 'running' || session.status === 'automationRunning') 
            ? storedPort 
            : undefined
        };
      });

      console.log('Sessions with debug ports:', updatedSessions);
      setSessions(updatedSessions);
      console.groupEnd();
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast.error(error.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  return { fetchSessions };
};
