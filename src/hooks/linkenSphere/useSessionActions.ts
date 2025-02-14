
import { toast } from 'sonner';
import { LinkenSphereSession } from './types';

interface UseSessionActionsProps {
  sessions: LinkenSphereSession[];
  setSessions: (sessions: LinkenSphereSession[]) => void;
  setLoadingSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionActions = ({
  sessions,
  setSessions,
  setLoadingSessions,
}: UseSessionActionsProps) => {
  const generateDebugPort = () => {
    return Math.floor(Math.random() * (65535 - 32000 + 1)) + 32000;
  };

  const startSession = async (sessionId: string) => {
    const debugPort = generateDebugPort();
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found');
      toast.error('Session not found');
      return;
    }

    setLoadingSessions(prev => new Set([...prev, sessionId]));

    try {
      console.log('Starting session with payload:', {
        uuid: session.uuid,
        headless: false,
        debug_port: debugPort
      });
      
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/start?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.uuid,
          headless: false,
          debug_port: debugPort
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to start session');
      }
      
      const data = await response.json();
      console.log('Start session response:', data);
      
      const updatedSessions = sessions.map(s => {
        if (s.id === sessionId) {
          const responsePort = data.debug_port || data.port || debugPort;
          console.log('Using port from response:', responsePort);
          const updatedSession = {
            ...s,
            status: 'running',
            debug_port: Number(responsePort)
          };
          console.log('Updated session:', updatedSession);
          return updatedSession;
        }
        return s;
      });
      
      console.log('Setting sessions to:', updatedSessions);
      setSessions(updatedSessions);
      
      const port_to_show = data.debug_port || data.port || debugPort;
      toast.success(`Session started on port ${port_to_show}`);
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    } finally {
      setLoadingSessions(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const stopSession = async (sessionId: string) => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found');
      toast.error('Session not found');
      return;
    }

    setLoadingSessions(prev => new Set([...prev, sessionId]));

    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/stop?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.uuid
        }),
      });

      const responseText = await response.text();
      console.log('Stop session response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to stop session: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }

      setSessions(sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'stopped', debug_port: undefined }
          : s
      ));
      
      toast.success('Session stopped successfully');
    } catch (error) {
      console.error('Error stopping session:', error);
      toast.error('Failed to stop session');
    } finally {
      setLoadingSessions(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  return {
    startSession,
    stopSession,
  };
};
