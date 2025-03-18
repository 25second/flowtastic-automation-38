
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  StopCircle, 
  Terminal, 
  Loader2
} from "lucide-react";

interface SessionItemProps {
  session: {
    id: string;
    name: string;
    status: string;
    debug_port?: number;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStartSession: (id: string) => void;
  onStopSession: (id: string) => void;
  isSessionActive: (status: string) => boolean;
  isLoading: boolean;
}

export function SessionItem({
  session,
  isSelected,
  onSelect,
  onStartSession,
  onStopSession,
  isSessionActive,
  isLoading
}: SessionItemProps) {
  const isActive = isSessionActive(session.status);
  const shouldShowStopButton = session.status !== 'stopped';

  return (
    <div 
      className={`flex items-center justify-between rounded-md border px-3 py-2 transition-colors cursor-pointer ${
        isSelected ? 'border-primary bg-accent/20' : 'border-border hover:bg-accent/10'
      }`}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex items-center space-x-3 min-w-0 overflow-hidden">
        <span className="font-medium truncate">{session.name}</span>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge 
            variant={isActive ? "success" : "secondary"} 
            className="text-xs"
          >
            {session.status}
          </Badge>
          
          {session.debug_port && session.status !== 'stopped' && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Terminal className="h-3 w-3" />
              {session.debug_port}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {shouldShowStopButton ? (
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onStopSession(session.id);
            }}
            disabled={isLoading}
            className="h-7 px-2"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <StopCircle className="h-3.5 w-3.5" />
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onStartSession(session.id);
            }}
            disabled={isLoading}
            className="h-7 px-2"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
