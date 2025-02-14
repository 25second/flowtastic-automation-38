
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
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      console.log('Fetched sessions:', data);

      // Обновляем сессии с сохраненными портами
      const updatedSessions = data.map((session: LinkenSphereSession) => {
        const savedPort = localStorage.getItem(`session_${session.id}_port`);
        if (savedPort && session.status === 'running') {
          return {
            ...session,
            debug_port: Number(savedPort)
          };
        }
        return session;
      });

      setSessions(updatedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  return { fetchSessions };
};
