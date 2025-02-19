
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useServerState } from "@/hooks/useServerState";
import { ServerMenu } from "./server-select/ServerMenu";
import { LinkenSphereSessions } from "./LinkenSphereSessions";
import { useSessionManagement } from "./browser-select/useSessionManagement";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WorkflowStartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const WorkflowStartDialog = ({
  open,
  onOpenChange,
  onConfirm
}: WorkflowStartDialogProps) => {
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

  // Restore state from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedToken = localStorage.getItem('serverToken');
      if (savedToken) {
        setServerToken(savedToken);
      }
      // Initialize selected servers with current server if it exists
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
    value: server.id
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
    
    // Set the last selected server as the active one for session fetching
    setSelectedServer(serverId);
    resetFetchState();
  };

  const handleToggleSession = (sessionId: string) => {
    if (!sessionId) return;
    
    const selectedSession = sessions.find(session => session.id === sessionId);
    console.log('Toggling session:', selectedSession);
    
    if (selectedSession && isSessionActive(selectedSession.status)) {
      setSelectedSessions(new Set([sessionId]));
      
      const sessionData = {
        id: selectedSession.id,
        status: selectedSession.status,
        debug_port: selectedSession.debug_port || 0
      };
      
      console.log('Setting selected browser to:', sessionData);
      setSelectedBrowser(sessionData);
    } else {
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
    }
  };

  const handleConfirm = async () => {
    if (selectedServers.size === 0) {
      toast.error('Please select at least one server');
      return;
    }

    if (!selectedBrowser) {
      toast.error('Please select a session');
      return;
    }

    console.log('Confirming with browser:', selectedBrowser);
    console.log('Selected servers:', Array.from(selectedServers));
    console.log('Server token:', serverToken);
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8">
          <ServerMenu
            servers={serverOptions}
            selectedServers={selectedServers}
            onServerSelect={handleServerSelect}
          />

          {selectedServer && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Session</h3>
              <div className="max-h-[500px] overflow-y-auto rounded-lg border border-border p-4">
                <LinkenSphereSessions
                  loading={loading}
                  sessions={sessions}
                  selectedSessions={selectedSessions}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onToggleSession={handleToggleSession}
                  onStartSession={startSession}
                  onStopSession={stopSession}
                  onStartSelected={startSelectedSessions}
                  onStopSelected={stopSelectedSessions}
                  isSessionActive={isSessionActive}
                  loadingSessions={loadingSessions}
                />
              </div>
            </div>
          )}

          {selectedServer && (
            <Button 
              onClick={handleConfirm}
              className="w-full"
              disabled={selectedServers.size === 0 || !selectedBrowser}
            >
              Start Workflow
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
