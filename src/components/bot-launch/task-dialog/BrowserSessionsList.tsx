
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <div className="space-y-4">
      <Label>Browser Sessions</Label>
      <Input
        placeholder="Search sessions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
      />
      <div className="border rounded-lg p-4 space-y-2">
        {sessions.map((session) => {
          const isSelected = selectedSessions.has(session.id);

          return (
            <div key={session.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id={`session-${session.id}`}
                  checked={isSelected}
                  onCheckedChange={() => {
                    // Create a new Set based on the current selection
                    const newSelected = new Set<string>();
                    
                    // If this session wasn't already selected, add only this one
                    // This ensures only one session can be selected at a time
                    if (!isSelected) {
                      newSelected.add(session.id);
                    }
                    
                    // Update the parent component with the new selection
                    onSessionSelect(newSelected);
                  }}
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
