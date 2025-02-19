
import { LinkenSphereSessions } from "../LinkenSphereSessions";

interface SessionSelectionSectionProps {
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
  setSearchQuery: (query: string) => void;
  onToggleSession: (sessionId: string) => void;
  startSession: (id: string) => void;
  stopSession: (id: string) => void;
  startSelectedSessions: () => void;
  stopSelectedSessions: () => void;
  isSessionActive: (status: string) => boolean;
  loadingSessions: Map<string, boolean>;
}

export const SessionSelectionSection = ({
  loading,
  sessions,
  selectedSessions,
  searchQuery,
  setSearchQuery,
  onToggleSession,
  startSession,
  stopSession,
  startSelectedSessions,
  stopSelectedSessions,
  isSessionActive,
  loadingSessions,
}: SessionSelectionSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Sessions</h3>
        <span className="text-sm text-muted-foreground">
          {selectedSessions.size} selected
        </span>
      </div>
      <div className="rounded-lg border border-border p-4">
        <LinkenSphereSessions
          loading={loading}
          sessions={sessions}
          selectedSessions={selectedSessions}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSession={onToggleSession}
          onStartSession={startSession}
          onStopSession={stopSession}
          onStartSelected={startSelectedSessions}
          onStopSelected={stopSelectedSessions}
          isSessionActive={isSessionActive}
          loadingSessions={loadingSessions}
        />
      </div>
    </div>
  );
};
