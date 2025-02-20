
import { toast } from 'sonner';
import { BrowserSession } from '@/types/task';

export const generateDebugPort = () => {
  return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
};

export const saveSessionPort = (sessionId: string, port: number) => {
  localStorage.setItem(`session_${sessionId}_port`, port.toString());
};

export const getStoredSessionPort = (sessionId: string): number | null => {
  const storedPort = localStorage.getItem(`session_${sessionId}_port`);
  return storedPort ? parseInt(storedPort, 10) : null;
};

export const useSessionManagement = () => {
  const checkSessionStatus = async (sessionId: string, port: string) => {
    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions status');
      }
      const sessions = await response.json();
      return sessions.find((s: any) => s.uuid === sessionId)?.status || 'stopped';
    } catch (error) {
      console.error('Error checking session status:', error);
      return 'unknown';
    }
  };

  const startBrowserSession = async (session: BrowserSession, port: string) => {
    if (!session.id) {
      throw new Error('Invalid session: missing ID');
    }

    const currentStatus = await checkSessionStatus(session.id, port);
    console.log(`Current status for session ${session.id}:`, currentStatus);

    if (currentStatus === 'running' || currentStatus === 'automationRunning') {
      const storedPort = getStoredSessionPort(session.id);
      if (storedPort) {
        return { port: storedPort };
      }
      return null;
    }

    if (currentStatus === 'stopped' || currentStatus === 'unknown') {
      const debugPort = generateDebugPort();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/start?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.id,
          headless: false,
          debug_port: debugPort
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start session: ${errorText}`);
      }

      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatus = await checkSessionStatus(session.id, port);
      if (newStatus !== 'running' && newStatus !== 'automationRunning') {
        throw new Error(`Session failed to start properly. Status: ${newStatus}`);
      }
      
      saveSessionPort(session.id, debugPort);
      return { port: debugPort };
    }

    return null;
  };

  return {
    startBrowserSession,
    checkSessionStatus
  };
};
