import { toast } from 'sonner';
import { LinkenSphereSession } from './types';

interface UseSessionActionsProps {
  sessions: LinkenSphereSession[];
  setSessions: (sessions: LinkenSphereSession[]) => void;
  setLoadingSessions: (callback: (prev: Map<string, boolean>) => Map<string, boolean>) => void;
}

export const useSessionActions = ({
  sessions,
  setSessions,
  setLoadingSessions,
}: UseSessionActionsProps) => {
  const generateDebugPort = (sessionId: string) => {
    const min = 32000;
    const max = 65535;
    const usedPorts = new Set(
      sessions
        .filter(s => s.id !== sessionId && s.debug_port !== undefined)
        .map(s => s.debug_port)
    );
    
    let port;
    do {
      port = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (usedPorts.has(port));
    
    return port;
  };

  const startSession = async (sessionId: string) => {
    const debugPort = generateDebugPort(sessionId);
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found:', sessionId);
      toast.error('Session not found');
      return;
    }

    setLoadingSessions(prev => {
      const next = new Map(prev);
      next.set(sessionId, true);
      return next;
    });

    try {
      console.log(`Starting session ${sessionId} with port ${debugPort}`);
      
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
        console.error(`Error starting session ${sessionId}:`, errorText);
        throw new Error('Failed to start session');
      }
      
      const data = await response.json();
      console.log(`Session ${sessionId} start response:`, data);
      
      const responsePort = data.debug_port || data.port || debugPort;
      
      const currentSessions = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`).then(r => r.json());
      
      const updatedSessions = sessions.map(s => {
        if (s.id === sessionId) {
          const serverSession = currentSessions.find((ss: any) => ss.uuid === s.uuid);
          return {
            ...s,
            status: serverSession?.status || 'running',
            debug_port: responsePort
          };
        }
        return s;
      });

      console.log('Setting updated sessions:', updatedSessions);
      setSessions(updatedSessions);
      
      toast.success(`Session ${sessionId} started on port ${responsePort}`);
    } catch (error) {
      console.error(`Error starting session ${sessionId}:`, error);
      toast.error('Failed to start session');
    } finally {
      setLoadingSessions(prev => {
        const next = new Map(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const stopSession = async (sessionId: string) => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found:', sessionId);
      toast.error('Session not found');
      return;
    }

    setLoadingSessions(prev => {
      const next = new Map(prev);
      next.set(sessionId, true);
      return next;
    });

    try {
      console.log(`Stopping session ${sessionId}`);
      
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/stop?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.uuid
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to stop session: ${errorText}`);
      }

      const currentSessions = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`).then(r => r.json());
      
      const updatedSessions = sessions.map(s => {
        if (s.id === sessionId) {
          const serverSession = currentSessions.find((ss: any) => ss.uuid === s.uuid);
          return {
            ...s,
            status: serverSession?.status || 'stopped',
            debug_port: undefined
          };
        }
        return s;
      });

      console.log('Setting updated sessions:', updatedSessions);
      setSessions(updatedSessions);
      
      toast.success(`Session ${sessionId} stopped successfully`);
    } catch (error) {
      console.error(`Error stopping session ${sessionId}:`, error);
      toast.error('Failed to stop session');
    } finally {
      setLoadingSessions(prev => {
        const next = new Map(prev);
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
