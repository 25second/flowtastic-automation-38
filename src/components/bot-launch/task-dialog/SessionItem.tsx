
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  StopCircle, 
  Loader2, 
  Terminal 
} from "lucide-react";

interface SessionItemProps {
  session: {
    id: string;
    name: string;
    status: string;
    debug_port?: number;
  };
  isSelected: boolean;
  onToggle: () => void;
  onStartSession: (id: string) => void;
  onStopSession: (id: string) => void;
  isSessionActive: (status: string) => boolean;
  isLoading: boolean;
  isExpanded: boolean;
  onToggleDetails: () => void;
}

export function SessionItem({
  session,
  isSelected,
  onToggle,
  onStartSession,
  onStopSession,
  isSessionActive,
  isLoading,
  isExpanded,
  onToggleDetails
}: SessionItemProps) {
  const isActive = isSessionActive(session.status);
  const shouldShowStopButton = session.status !== 'stopped';

  return (
    <div 
      className={`relative rounded-md border px-3 py-2 transition-colors cursor-pointer hover:bg-accent/10 ${
        isSelected ? 'border-primary bg-accent/20' : 'border-border'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <RadioGroupItem
            value={session.id}
            id={`session-${session.id}`}
            className="sr-only"
          />
          
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <span className="font-medium truncate">{session.name}</span>
            
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
        
        <div className="flex items-center gap-1 ml-2">
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
          
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggleDetails();
            }}
            className="h-7 w-7 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-1">
            <div className="truncate">
              <span className="font-medium">ID:</span> {session.id}
            </div>
            <div>
              <span className="font-medium">Port:</span> {session.debug_port || 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
