
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { SessionItem } from "./SessionItem";

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
  const handleSessionSelect = (sessionId: string) => {
    onSessionSelect(new Set([sessionId]));
  };

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
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-1">
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isSelected={selectedSessions.has(session.id)}
                onSelect={handleSessionSelect}
                onStartSession={onStartSession}
                onStopSession={onStopSession}
                isSessionActive={isSessionActive}
                isLoading={loadingSessions.get(session.id) || false}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
