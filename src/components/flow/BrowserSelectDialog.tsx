
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useServerState } from "@/hooks/useServerState";
import { useState } from "react";
import { LinkenSphereSessions } from "./LinkenSphereSessions";
import { ServerSelect } from "./browser-select/ServerSelect";
import { BrowserTypeSelect } from "./browser-select/BrowserTypeSelect";
import { ChromeBrowserSelect } from "./browser-select/ChromeBrowserSelect";
import { useSessionManagement } from "./browser-select/useSessionManagement";

interface BrowserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  dialogTitle: string;
  dialogDescription: string;
  isForRecording: boolean;
}

export const BrowserSelectDialog = ({
  open,
  onOpenChange,
  onConfirm,
  dialogTitle,
  dialogDescription,
  isForRecording
}: BrowserSelectDialogProps) => {
  const {
    selectedServer,
    setSelectedServer,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    servers,
  } = useServerState();

  const [browserType, setBrowserType] = useState<'chrome' | 'linkenSphere'>('chrome');

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
    setHasInitiallyFetched
  } = useSessionManagement(open, browserType, setSelectedBrowser);

  const serverOptions = servers.map((server) => ({
    id: server.id,
    label: server.name || server.url,
    value: server.id
  }));

  const handleBrowserTypeChange = (value: 'chrome' | 'linkenSphere') => {
    setBrowserType(value);
    setSelectedBrowser(null);
    setSelectedSessions(new Set());
    if (value === 'linkenSphere') {
      setHasInitiallyFetched(false);
    }
  };

  const handleToggleSession = (sessionId: string) => {
    if (!sessionId) return;
    console.log('Toggling session:', sessionId);
    
    const selectedSession = sessions.find(session => session.id === sessionId);
    console.log('Found session:', selectedSession);

    if (selectedSession && isSessionActive(selectedSession.status)) {
      console.log('Session is active, setting as selected');
      setSelectedSessions(new Set([sessionId]));
      console.log('Setting browser to session:', selectedSession);
      setSelectedBrowser(selectedSession);
    } else {
      console.log('Session is not active or not found');
      setSelectedSessions(new Set());
      setSelectedBrowser(null);
    }
  };

  const getSelectedSession = () => {
    if (browserType !== 'linkenSphere' || selectedSessions.size !== 1) return null;
    const selectedSessionId = Array.from(selectedSessions)[0];
    if (!selectedSessionId) return null;
    const session = sessions.find(session => session.id === selectedSessionId);
    return session;
  };

  const selectedSession = getSelectedSession();
  const hasActiveSession = selectedSession && isSessionActive(selectedSession.status);
  
  const isConfirmDisabled = !selectedServer || (
    browserType === 'chrome' ? !selectedBrowser : !hasActiveSession
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <ServerSelect
            serverOptions={serverOptions}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
          />

          {selectedServer && (
            <BrowserTypeSelect
              browserType={browserType}
              onBrowserTypeChange={handleBrowserTypeChange}
            />
          )}

          {selectedServer && browserType === 'chrome' ? (
            <ChromeBrowserSelect
              browsers={browsers}
              selectedBrowser={typeof selectedBrowser === 'number' ? selectedBrowser : null}
              setSelectedBrowser={(port) => setSelectedBrowser(port)}
            />
          ) : selectedServer && browserType === 'linkenSphere' ? (
            <div className="max-h-[400px] overflow-y-auto">
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
          ) : null}

          {selectedServer && (
            <Button 
              onClick={onConfirm} 
              className="w-full"
              disabled={isConfirmDisabled}
            >
              Confirm
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
