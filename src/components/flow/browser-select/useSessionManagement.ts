
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
  const [shouldReset, setShouldReset] = useState(false);

  // Handle initial fetch of sessions
  useEffect(() => {
    const handleInitialFetch = async () => {
      if (open && browserType === 'linkenSphere' && !hasInitiallyFetched) {
        await fetchSessions();
        setHasInitiallyFetched(true);
      }
    };

    handleInitialFetch();
  }, [open, browserType, hasInitiallyFetched, fetchSessions]);

  // Handle dialog close cleanup
  useEffect(() => {
    if (!open && !shouldReset) {
      setShouldReset(true);
    } else if (!open && shouldReset) {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
      setHasInitiallyFetched(false);
      setShouldReset(false);
    }
  }, [open, shouldReset, setSelectedSessions, setSelectedBrowser]);

  const isSessionActive = (status: string) => {
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
