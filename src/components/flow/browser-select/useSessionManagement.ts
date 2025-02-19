
import { useEffect, useState, useCallback } from "react";
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

  const resetState = useCallback(() => {
    setSelectedSessions(new Set());
    setSelectedBrowser(null);
    setHasInitiallyFetched(false);
  }, [setSelectedSessions, setSelectedBrowser]);

  // Handle initial fetch of sessions
  useEffect(() => {
    let isMounted = true;

    const handleInitialFetch = async () => {
      if (open && browserType === 'linkenSphere' && !hasInitiallyFetched) {
        await fetchSessions();
        if (isMounted) {
          setHasInitiallyFetched(true);
        }
      }
    };

    handleInitialFetch();

    return () => {
      isMounted = false;
    };
  }, [open, browserType, hasInitiallyFetched, fetchSessions]);

  // Handle dialog close cleanup
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

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
