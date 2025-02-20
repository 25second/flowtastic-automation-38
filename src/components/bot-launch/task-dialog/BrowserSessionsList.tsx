
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface BrowserSessionsListProps {
  sessions: any[];
  selectedSessions: Set<string>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSessionSelect: (sessions: Set<string>) => void;
  isSessionActive: (status: string) => boolean;
  loadingSessions: Map<string, boolean>;
  onStartSession: (id: string) => void;
  onStopSession: (id: string) => void;
  selectedServers: Set<string>;
}

export function BrowserSessionsList({
  sessions,
  selectedSessions,
  searchQuery,
  onSearchChange,
  onSessionSelect,
  isSessionActive,
  loadingSessions,
  onStartSession,
  onStopSession,
  selectedServers
}: BrowserSessionsListProps) {
  const isDisabled = selectedServers.size === 0;

  return (
    <div className="space-y-4">
      <Label>Browser Sessions</Label>
      <Input
        placeholder="Search sessions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
        disabled={isDisabled}
      />
      <div className={`border rounded-lg p-4 space-y-2 ${isDisabled ? 'opacity-50' : ''}`}>
        {sessions.map((session) => {
          const isActive = isSessionActive(session.status);
          const isSelected = selectedSessions.has(session.id);
          const isLoading = loadingSessions.get(session.id);

          return (
            <div key={session.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={isSelected}
                  onCheckedChange={() => {
                    const newSelected = new Set(selectedSessions);
                    if (isSelected) {
                      newSelected.delete(session.id);
                    } else {
                      newSelected.add(session.id);
                    }
                    onSessionSelect(newSelected);
                  }}
                  disabled={isDisabled}
                />
                <div>
                  <p className="font-medium">{session.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {session.status} {session.debug_port && `(Port: ${session.debug_port})`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
