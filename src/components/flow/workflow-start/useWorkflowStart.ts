
import { useState, useEffect } from "react";
import { useServerState } from "@/hooks/useServerState";
import { useSessionManagement } from "../browser-select/useSessionManagement";
import { toast } from "sonner";

export const useWorkflowStart = (open: boolean) => {
  const {
    selectedServer,
    setSelectedServer,
    servers,
    selectedBrowser,
    setSelectedBrowser,
    serverToken,
    setServerToken
  } = useServerState();

  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());

  const {
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
  } = useSessionManagement(open, 'linkenSphere', setSelectedBrowser);

  useEffect(() => {
    if (open) {
      const savedToken = localStorage.getItem('serverToken');
      if (savedToken) {
        setServerToken(savedToken);
      }
      if (selectedServer) {
        setSelectedServers(new Set([selectedServer]));
      } else {
        setSelectedServers(new Set());
      }
    }
  }, [open, setServerToken, selectedServer]);

  const serverOptions = servers.map((server) => ({
    id: server.id,
    label: server.name || server.url,
    value: server.id,
    is_active: server.is_active
  }));

  const handleServerSelect = (serverId: string) => {
    setSelectedServers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      return newSet;
    });
    
    setSelectedServer(serverId);
    resetFetchState();
  };

  const handleToggleSession = (sessionId: string) => {
    if (!sessionId) return;
    
    const selectedSession = sessions.find(session => session.id === sessionId);
    console.log('Toggling session:', selectedSession);
    
    if (selectedSession && isSessionActive(selectedSession.status)) {
      setSelectedSessions(new Set([sessionId]));
      
      if (selectedSession.debug_port) {
        const sessionData = {
          id: selectedSession.id,
          status: selectedSession.status,
          debug_port: selectedSession.debug_port
        };
        
        console.log('Setting selected browser to:', sessionData);
        setSelectedBrowser(sessionData);
      } else {
        console.error('Selected session has no debug port');
        toast.error('Selected session has no debug port');
        setSelectedBrowser(null);
      }
    } else {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
    }
  };

  const validateWorkflowStart = () => {
    if (selectedServers.size === 0) {
      toast.error('Please select at least one server');
      return false;
    }

    if (!selectedBrowser) {
      toast.error('Please select a session');
      return false;
    }

    if (typeof selectedBrowser === 'object' && !selectedBrowser.debug_port) {
      toast.error('Selected session has no debug port');
      return false;
    }

    return true;
  };

  return {
    selectedServer,
    selectedServers,
    serverOptions,
    selectedBrowser,
    serverToken,
    sessions,
    loading,
    selectedSessions,
    searchQuery,
    setSearchQuery,
    handleServerSelect,
    handleToggleSession,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    loadingSessions,
    isSessionActive,
    validateWorkflowStart
  };
};
