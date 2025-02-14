
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLinkenSphere } from "@/hooks/linkenSphere";
import { useEffect, useState } from "react";
import { LinkenSphereSessions } from "./LinkenSphereSessions";
import { useServerState } from "@/hooks/useServerState";

interface BrowserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  dialogTitle: string;
  dialogDescription: string;
}

export const BrowserSelectDialog = ({
  open,
  onOpenChange,
  onConfirm,
  dialogTitle,
  dialogDescription
}: BrowserSelectDialogProps) => {
  const {
    selectedServer,
    setSelectedServer,
    serverToken,
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
    toggleSession, 
    searchQuery, 
    setSearchQuery, 
    fetchSessions,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    loadingSessions
  } = useLinkenSphere();

  useEffect(() => {
    if (open && browserType === 'linkenSphere') {
      fetchSessions();
    }
  }, [open, browserType]);

  useEffect(() => {
    if (browserType === 'linkenSphere') {
      setSelectedBrowser(null);
    }
  }, [browserType]);

  useEffect(() => {
    if (browserType === 'linkenSphere' && selectedSessions.size === 1) {
      const selectedSessionId = Array.from(selectedSessions)[0];
      const selectedSession = sessions.find(session => session.id === selectedSessionId);
      
      if (selectedSession && (selectedSession.status === 'running' || selectedSession.debug_port)) {
        setSelectedBrowser(selectedSession.debug_port || null);
      } else {
        setSelectedBrowser(null);
      }
    }
  }, [selectedSessions, sessions, browserType]);

  const serverOptions = servers.map((server) => ({
    id: server.id,
    label: server.name || server.url,
    value: server.id
  }));

  const isSessionActive = (status: string) => {
    return status === 'running' || status === 'active';
  };

  const hasActiveSession = browserType === 'linkenSphere' && selectedSessions.size === 1 && sessions.some(session => 
    selectedSessions.has(session.id) && 
    (session.debug_port !== undefined || isSessionActive(session.status))
  );

  const isConfirmDisabled = 
    !selectedServer || 
    (browserType === 'chrome' ? !selectedBrowser : !hasActiveSession || !selectedBrowser);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Server</label>
            <Select
              value={selectedServer || undefined}
              onValueChange={setSelectedServer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {serverOptions.map((server) => (
                  <SelectItem key={server.id} value={server.value}>
                    {server.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedServer && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Browser Type</label>
              <RadioGroup
                value={browserType}
                onValueChange={(value: 'chrome' | 'linkenSphere') => {
                  setBrowserType(value);
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chrome" id="chrome" />
                  <Label htmlFor="chrome">Chrome</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linkenSphere" id="linkenSphere" />
                  <Label htmlFor="linkenSphere">Linken Sphere</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {selectedServer && browserType === 'chrome' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Browser</label>
              <Select
                value={selectedBrowser?.toString()}
                onValueChange={(value) => setSelectedBrowser(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select browser" />
                </SelectTrigger>
                <SelectContent>
                  {browsers.map((browser) => (
                    <SelectItem key={browser.port} value={browser.port.toString()}>
                      {browser.name} ({browser.type}) - Port: {browser.port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : selectedServer && browserType === 'linkenSphere' ? (
            <div className="max-h-[400px] overflow-y-auto">
              <LinkenSphereSessions
                loading={loading}
                sessions={sessions}
                selectedSessions={selectedSessions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onToggleSession={toggleSession}
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
