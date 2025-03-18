
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { SessionItem } from "./SessionItem";
import { RadioGroup } from "@/components/ui/radio-group";

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
}: BrowserSessionsListProps) {
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  const toggleSessionDetails = (sessionId: string) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedDetails(newExpanded);
  };

  // Handle session toggle - always select just one session
  const handleToggleSession = (sessionId: string) => {
    // Always create a new Set with only this session
    onSessionSelect(new Set([sessionId]));
  };

  // Get the first (and only) selected session ID or empty string
  const selectedSessionId = Array.from(selectedSessions)[0] || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Browser Sessions</Label>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {sessions.length === 0 ? (
        <div className="p-4 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No sessions available</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[300px] pr-3">
          <RadioGroup 
            value={selectedSessionId} 
            onValueChange={(value) => handleToggleSession(value)}
            className="space-y-1"
          >
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isSelected={selectedSessions.has(session.id)}
                onToggle={() => handleToggleSession(session.id)}
                onStartSession={onStartSession}
                onStopSession={onStopSession}
                isSessionActive={isSessionActive}
                isLoading={loadingSessions.get(session.id) || false}
                isExpanded={expandedDetails.has(session.id)}
                onToggleDetails={() => toggleSessionDetails(session.id)}
              />
            ))}
          </RadioGroup>
        </ScrollArea>
      )}
    </div>
  );
}
