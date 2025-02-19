
import { LinkenSphereSessions } from "../LinkenSphereSessions";
import { useServerState } from "@/hooks/useServerState";

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
      <h3 className="text-lg font-semibold">Select Session</h3>
      <div className="max-h-[500px] overflow-y-auto rounded-lg border border-border p-4">
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
