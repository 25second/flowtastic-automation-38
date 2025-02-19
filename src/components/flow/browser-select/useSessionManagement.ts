
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

  // Only fetch sessions when needed
  useEffect(() => {
    let mounted = true;

    if (open && browserType === 'linkenSphere' && !hasInitiallyFetched) {
      fetchSessions().then(() => {
        if (mounted) {
          setHasInitiallyFetched(true);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [open, browserType, hasInitiallyFetched, fetchSessions]);

  // Reset state only when dialog closes
  useEffect(() => {
    if (!open && hasInitiallyFetched) {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
      setHasInitiallyFetched(false);
    }
  }, [open, hasInitiallyFetched, setSelectedSessions, setSelectedBrowser]);

  const isSessionActive = (status: string) => {
    return status === 'running' || status === 'automationRunning';
  };

  const resetFetchState = useCallback(() => {
    setHasInitiallyFetched(false);
  }, []);

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
