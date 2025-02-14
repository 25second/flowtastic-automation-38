
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
  const fetchSessions = async () => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    setLoading(true);

    try {
      console.log('Fetching sessions with port:', port);
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

      // Проверяем наличие сохраненных портов для сессий
      const updatedSessions = data.map((session: LinkenSphereSession) => {
        const sessionStorageKey = `session_${session.uuid}_port`;
        const savedPort = localStorage.getItem(sessionStorageKey);

        // Если есть сохраненный порт - используем его
        if (savedPort && (session.status === 'running' || session.status === 'automationRunning')) {
          return {
            ...session,
            id: session.uuid,
            debug_port: parseInt(savedPort)
          };
        }

        // Если нет сохраненного порта и сессия активна - генерируем новый
        if ((session.status === 'running' || session.status === 'automationRunning') && !session.debug_port) {
          const newPort = Math.floor(Math.random() * (50000 - 40000 + 1)) + 40000;
          localStorage.setItem(sessionStorageKey, newPort.toString());
          return {
            ...session,
            id: session.uuid,
            debug_port: newPort
          };
        }

        // Для неактивных сессий просто возвращаем как есть
        return {
          ...session,
          id: session.uuid
        };
      });

      console.log('Sessions with debug ports:', updatedSessions);
      setSessions(updatedSessions);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast.error(error.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  return { fetchSessions };
};
