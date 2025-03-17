
import { useState, useEffect } from 'react';
import { fetchBrowserSessions } from '@/utils/agents/browserProxyService';

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
    isSessionActive
  };
};
