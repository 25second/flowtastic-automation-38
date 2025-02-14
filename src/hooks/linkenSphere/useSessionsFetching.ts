
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
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      console.log('Raw sessions data:', data);
      
      const sessionsWithUuid = data.map((session: any) => {
        const debug_port = session.debug_port?._type === 'undefined' ? undefined : 
                         typeof session.debug_port === 'number' ? session.debug_port :
                         typeof session.debug_port === 'string' ? Number(session.debug_port) :
                         undefined;
        
        const mappedSession = {
          ...session,
          id: session.id || session.uuid,
          uuid: session.uuid,
          debug_port
        };
        console.log('Mapped session:', mappedSession);
        return mappedSession;
      });
      
      console.log('Final sessions:', sessionsWithUuid);
      setSessions(sessionsWithUuid);
    } catch (error) {
      console.error('Error fetching Linken Sphere sessions:', error);
      toast.error('Failed to fetch Linken Sphere sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  return { fetchSessions };
};
