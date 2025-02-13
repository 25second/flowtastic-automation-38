
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLinkenSphere } from "@/hooks/useLinkenSphere";
import { useEffect, useState } from "react";
import { Loader2, Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
  const { 
    sessions, 
    loading, 
    selectedSessions, 
    toggleSession, 
    searchQuery, 
    setSearchQuery, 
    fetchSessions,
    startSession 
  } = useLinkenSphere();

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
                  onBrowserSelect(0);
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
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading sessions...
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {sessions.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedSessions.has(session.id)}
                          onCheckedChange={() => toggleSession(session.id)}
                        />
                        <div>
                          <div className="font-medium">{session.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Status: {session.status}
                            {session.debug_port && ` • Port: ${session.debug_port}`}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startSession(session.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={onConfirm} 
            className="w-full"
            disabled={browserType === 'chrome' ? !selectedBrowser : selectedSessions.size === 0}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
