
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Play, StopCircle } from "lucide-react";
import { LinkenSphereSession } from "./LinkenSphereSession";

interface LinkenSphereSessionsProps {
  loading: boolean;
  sessions: Array<{
    id: string;
    name: string;
    status: string;
    uuid: string;
    debug_port?: number;
  }>;
  selectedSessions: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSession: (id: string) => void;
  onStartSession: (id: string) => void;
  onStopSession: (id: string) => void;
  onStartSelected: () => void;
  onStopSelected: () => void;
  isSessionActive: (status: string) => boolean;
  loadingSessions: Map<string, boolean>;
}

export const LinkenSphereSessions = ({
  loading,
  sessions,
  selectedSessions,
  searchQuery,
  onSearchChange,
  onToggleSession,
  onStartSession,
  onStopSession,
  onStartSelected,
  onStopSelected,
  isSessionActive,
  loadingSessions,
}: LinkenSphereSessionsProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="max-h-[300px] overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sessions...
          </div>
        ) : (
          sessions.map((session) => (
            <LinkenSphereSession
              key={session.id}
              session={session}
              isSelected={selectedSessions.has(session.id)}
              onToggle={(id) => {
                // Сначала очищаем все выбранные сессии
                selectedSessions.clear();
                // Затем добавляем только выбранную сессию
                onToggleSession(id);
              }}
              onStart={onStartSession}
              onStop={onStopSession}
              isSessionActive={isSessionActive}
              loadingSessions={loadingSessions}
            />
          ))
        )}
      </div>
    </div>
  );
};
