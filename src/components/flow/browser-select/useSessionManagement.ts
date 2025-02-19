
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
    }

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
