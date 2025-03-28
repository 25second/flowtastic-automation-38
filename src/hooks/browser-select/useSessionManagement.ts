
import { useEffect, useState } from "react";
import { useLinkenSphere } from "@/hooks/linkenSphere";

interface Session {
  id: string;
  status: string;
  debug_port?: number;
}

export const useSessionManagement = (
  open: boolean,
  browserType: 'chrome' | 'linkenSphere',
  setSelectedBrowser: (browser: number | Session | null) => void
) => {
  const { 
    sessions, 
    loading, 
    selectedSessions, 
    toggleSession, 
    searchQuery, 
    setSearchQuery, 
    fetchSessions,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    loadingSessions,
    setSelectedSessions
  } = useLinkenSphere();

  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  useEffect(() => {
    if (open && browserType === 'linkenSphere' && !hasInitiallyFetched) {
      fetchSessions();
      setHasInitiallyFetched(true);

      // Check for any running sessions with debug ports
      const runningSession = sessions.find(session => {
        const isRunning = isSessionActive(session.status);
        const hasPort = session.debug_port !== undefined && session.debug_port > 0;
        return isRunning && hasPort;
      });

      if (runningSession) {
        console.log('Found running session with port:', runningSession);
        setSelectedSessions(new Set([runningSession.id]));
        setSelectedBrowser({
          id: runningSession.id,
          status: runningSession.status,
          debug_port: runningSession.debug_port || 0
        });
      }
    }

    if (!open) {
      setHasInitiallyFetched(false);
    }
  }, [open, browserType, fetchSessions, hasInitiallyFetched, sessions]);

  useEffect(() => {
    if (!open) {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
    }
  }, [open, setSelectedSessions, setSelectedBrowser]);

  const isSessionActive = (status: string) => {
    console.log('Checking session status:', status);
    return status === 'running' || status === 'automationRunning';
  };

  const resetFetchState = () => {
    setHasInitiallyFetched(false);
  };

  return {
    sessions,
    loading,
    selectedSessions,
    searchQuery,
    setSearchQuery,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    loadingSessions,
    setSelectedSessions,
    isSessionActive,
    resetFetchState
  };
};
