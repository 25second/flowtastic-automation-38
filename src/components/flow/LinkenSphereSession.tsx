
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, StopCircle, Terminal, Copy, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LinkenSphereSessionProps {
  session: {
    id: string;
    name: string;
    status: string;
    uuid: string;
    debug_port?: number;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  isSessionActive: (status: string) => boolean;
  loadingSessions?: Set<string>;
}

export const LinkenSphereSession = ({
  session,
  isSelected,
  onToggle,
  onStart,
  onStop,
  isSessionActive,
  loadingSessions = new Set(),
}: LinkenSphereSessionProps) => {
  const shouldShowStopButton = session.status !== 'stopped';
  const isActive = isSessionActive(session.status);
  const isLoading = loadingSessions.has(session.id);

  const handleCopyUUID = async () => {
    try {
      await navigator.clipboard.writeText(session.uuid);
      toast.success("UUID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy UUID");
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded hover:bg-accent">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(session.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <div>
          <div className="font-medium flex items-center gap-2">
            {session.name}
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500 hover:bg-green-600" : ""}>
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
          <div 
            className="text-xs text-muted-foreground truncate max-w-[200px] flex items-center gap-1 cursor-pointer hover:text-foreground"
            onClick={handleCopyUUID}
          >
            UUID: {session.uuid}
            <Copy className="h-3 w-3" />
          </div>
        </div>
      </div>
      {shouldShowStopButton ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onStop(session.id)}
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
          onClick={() => onStart(session.id)}
          disabled={isSelected || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
