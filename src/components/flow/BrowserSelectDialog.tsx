
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLinkenSphere } from "@/hooks/useLinkenSphere";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ServerOption {
  id: string;
  label: string;
  value: string;
}

interface BrowserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servers: ServerOption[];
  selectedServer: string | null;
  onServerSelect: (server: string) => void;
  browsers: Array<{port: number, name: string, type: string}>;
  selectedBrowser: number | null;
  onBrowserSelect: (port: number) => void;
  onConfirm: () => Promise<void>;
}

export const BrowserSelectDialog = ({
  open,
  onOpenChange,
  servers,
  selectedServer,
  onServerSelect,
  browsers,
  selectedBrowser,
  onBrowserSelect,
  onConfirm,
}: BrowserSelectDialogProps) => {
  const [browserType, setBrowserType] = useState<'chrome' | 'linkenSphere'>('chrome');
  const { sessions, loading, selectedSession, setSelectedSession, fetchSessions } = useLinkenSphere();

  useEffect(() => {
    if (open && browserType === 'linkenSphere') {
      fetchSessions();
    }
  }, [open, browserType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Browser</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Server</label>
            <Select
              value={selectedServer || undefined}
              onValueChange={onServerSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.value}>
                    {server.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Browser Type</label>
            <RadioGroup
              value={browserType}
              onValueChange={(value: 'chrome' | 'linkenSphere') => {
                setBrowserType(value);
                if (value === 'linkenSphere') {
                  onBrowserSelect(0); // Reset Chrome browser selection
                } else {
                  setSelectedSession(null); // Reset Linken Sphere session selection
                }
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

          {browserType === 'chrome' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Browser</label>
              <Select
                value={selectedBrowser?.toString()}
                onValueChange={(value) => onBrowserSelect(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select browser" />
                </SelectTrigger>
                <SelectContent>
                  {browsers.map((browser) => (
                    <SelectItem key={browser.port} value={browser.port.toString()}>
                      {browser.name} ({browser.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Linken Sphere Session</label>
              <Select
                value={selectedSession || undefined}
                onValueChange={setSelectedSession}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? 'Loading sessions...' : 'Select session'} />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name} ({session.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading sessions...
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={onConfirm} 
            className="w-full"
            disabled={browserType === 'chrome' ? !selectedBrowser : !selectedSession}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
