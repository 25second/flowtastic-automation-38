
import { useState, useEffect } from 'react';
import { fetchBrowserSessions } from '@/utils/agents/browserProxyService';
import { BrowserSession } from '@/types/task';

export const getStoredSessionPort = (sessionId: string): number | null => {
  const storedPort = localStorage.getItem(`session_${sessionId}_port`);
  return storedPort ? parseInt(storedPort, 10) : null;
};

export const storeSessionPort = (sessionId: string, port: number): void => {
  localStorage.setItem(`session_${sessionId}_port`, port.toString());
};

export const useSessionManagement = () => {
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async (browserType: string) => {
    if (!browserType) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const sessionsData = await fetchBrowserSessions(browserType);
      setSessions(sessionsData);
      
      // Auto-select first running session if any
      const runningSession = sessionsData.find(session => isSessionActive(session.status));
      if (runningSession) {
        setSelectedSession(runningSession.id);
        
        // If there's a stored port for this session, use it
        const port = getStoredSessionPort(runningSession.id);
        if (port) {
          runningSession.debug_port = port;
        }
      }
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      setError(error.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const isSessionActive = (status: string): boolean => {
    return status === 'running' || status === 'automationRunning';
  };

  // Add the missing methods
  const startBrowserSession = async (session: BrowserSession, port: string = '40080'): Promise<{ port: number } | null> => {
    try {
      console.log(`Starting browser session ${session.id} on port ${port}`);
      
      // This would typically make an API call to start the session
      // For now, we'll just simulate it by returning a debug port
      const debugPort = 9222 + Math.floor(Math.random() * 1000);
      
      // Store the debug port
      storeSessionPort(session.id, debugPort);
      
      return { port: debugPort };
    } catch (error: any) {
      console.error('Error starting browser session:', error);
      return null;
    }
  };

  const checkSessionStatus = async (sessionId: string, port: string = '40080'): Promise<string> => {
    try {
      console.log(`Checking session status for ${sessionId} on port ${port}`);
      
      // Typically this would make an API call to check the session status
      // For now, we'll just return a simulated status
      const session = sessions.find(s => s.id === sessionId);
      return session ? session.status : 'unknown';
    } catch (error: any) {
      console.error('Error checking session status:', error);
      return 'error';
    }
  };

  useEffect(() => {
    if (selectedBrowser) {
      fetchSessions(selectedBrowser);
    }
  }, [selectedBrowser]);

  return {
    selectedBrowser,
    setSelectedBrowser,
    sessions,
    selectedSession,
    setSelectedSession,
    loading,
    error,
    fetchSessions,
    isSessionActive,
    startBrowserSession,
    checkSessionStatus
  };
};
