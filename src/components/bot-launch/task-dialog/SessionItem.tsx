
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <Card className={`border transition-colors ${
      isSelected ? 'border-primary shadow-sm' : 'hover:border-muted-foreground/20'
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`session-${session.id}`}
              checked={isSelected}
              onCheckedChange={onToggle}
            />
            <div>
              <Label 
                htmlFor={`session-${session.id}`} 
                className="font-medium cursor-pointer"
              >
                {session.name}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={isActive ? "default" : "secondary"} 
                  className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {session.status}
                </Badge>
                {session.debug_port && session.status !== 'stopped' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Terminal className="h-3 w-3" />
                    {session.debug_port}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {shouldShowStopButton ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onStopSession(session.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <StopCircle className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStartSession(session.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleDetails}
              className="p-0 w-8 h-8"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">ID:</span> {session.id}
              </div>
              <div>
                <span className="text-muted-foreground">Port:</span> {session.debug_port || 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
