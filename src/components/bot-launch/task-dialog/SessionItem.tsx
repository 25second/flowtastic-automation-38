
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";

interface SessionItemProps {
  session: {
    id: string;
    name: string;
    status: string;
    debug_port?: number;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  isSessionActive: (status: string) => boolean;
}

export function SessionItem({
  session,
  isSelected,
  onSelect,
  isSessionActive,
}: SessionItemProps) {
  const isActive = isSessionActive(session.status);

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
    </div>
  );
}
