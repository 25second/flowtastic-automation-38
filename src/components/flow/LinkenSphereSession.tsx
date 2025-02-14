
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2, Play, StopCircle } from "lucide-react";

interface LinkenSphereSessionProps {
  session: {
    id: string;
    name: string;
    status: string;
    uuid: string;
    debug_port?: number;
  };
  isSelected: boolean;
  onToggle: (event: React.MouseEvent) => void;
  onStart: () => void;
  onStop: () => void;
  isSessionActive: (status: string) => boolean;
  loadingSessions: Map<string, boolean>;
}

export const LinkenSphereSession = ({
  session,
  isSelected,
  onToggle,
  onStart,
  onStop,
  isSessionActive,
  loadingSessions,
}: LinkenSphereSessionProps) => {
  const isLoading = loadingSessions.get(session.id);
  const isActive = isSessionActive(session.status);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(e);
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary"
          )}>
            {isSelected && <Check className="w-3 h-3" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{session.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {session.uuid}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              isActive ? onStop() : onStart();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isActive ? (
              <StopCircle className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
