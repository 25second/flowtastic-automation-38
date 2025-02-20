
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
    const fetchInitialSessions = async () => {
      if (open && browserType === 'linkenSphere' && !hasInitiallyFetched) {
        console.group('Initial Session Fetch');
        console.log('Fetching initial sessions state');
        await fetchSessions();
        setHasInitiallyFetched(true);
        console.groupEnd();
      }
    };

    fetchInitialSessions();

    if (!open) {
      setHasInitiallyFetched(false);
    }
  }, [open, browserType, fetchSessions, hasInitiallyFetched]);

  useEffect(() => {
    if (!open) {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
    }
  }, [open, setSelectedSessions, setSelectedBrowser]);

  const isSessionActive = (status: string) => {
    return status === 'running' || status === 'automationRunning';
  };

  const resetFetchState = () => {
    setHasInitiallyFetched(false);
  };

  // Automatically set the selected browser when a session is selected and active
  useEffect(() => {
    if (selectedSessions.size === 1) {
      const selectedSessionId = Array.from(selectedSessions)[0];
      const selectedSession = sessions.find(s => s.id === selectedSessionId);
      
      if (selectedSession && isSessionActive(selectedSession.status) && selectedSession.debug_port) {
        console.log('Setting selected browser session:', {
          id: selectedSession.id,
          status: selectedSession.status,
          debug_port: selectedSession.debug_port
        });

        setSelectedBrowser({
          id: selectedSession.id,
          status: selectedSession.status,
          debug_port: selectedSession.debug_port
        });
      }
    }
  }, [selectedSessions, sessions, setSelectedBrowser]);

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
