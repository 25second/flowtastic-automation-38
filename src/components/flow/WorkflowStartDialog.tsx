
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useServerState } from "@/hooks/useServerState";
import { ServerMenu } from "./server-select/ServerMenu";
import { LinkenSphereSessions } from "./LinkenSphereSessions";
import { useSessionManagement } from "./browser-select/useSessionManagement";
import { useEffect } from "react";
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
    }
  }, [open, setServerToken]);

  const serverOptions = servers.map((server) => ({
    id: server.id,
    label: server.name || server.url,
    value: server.id
  }));

  const handleServerSelect = (serverId: string) => {
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
    if (!selectedServer) {
      toast.error('Please select a server');
      return;
    }

    if (!selectedBrowser) {
      toast.error('Please select a session');
      return;
    }

    console.log('Confirming with browser:', selectedBrowser);
    console.log('Server:', selectedServer);
    console.log('Server token:', serverToken);
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8">
          <ServerMenu
            servers={serverOptions}
            selectedServer={selectedServer}
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
              disabled={!selectedBrowser || !selectedServer}
            >
              Start Workflow
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
