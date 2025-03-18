
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Session } from "@/hooks/ai-agents/agent-execution/types";
import { useLanguage } from "@/hooks/useLanguage";

interface SessionSelectionProps {
  loadingSessions: boolean;
  runningSessions: Session[];
  selectedSession: string | null;
  setSelectedSession: (sessionId: string) => void;
}

export function SessionSelection({
  loadingSessions,
  runningSessions,
  selectedSession,
  setSelectedSession
}: SessionSelectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('agents.select_session')}</h3>
      {loadingSessions ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : runningSessions.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          {t('agents.no_running_sessions')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {runningSessions.map((session) => (
            <div 
              key={session.id}
              className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedSession === session.id ? 'border-primary bg-accent/50' : ''
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className={`w-3 h-3 rounded-full ${
                session.status === 'running' || session.status === 'automationRunning' 
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
              }`} />
              <div>
                <p className="font-medium">{session.name}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {session.status} {session.debug_port && `(Port: ${session.debug_port})`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
