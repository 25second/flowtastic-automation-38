
import { cn } from "@/lib/utils";
import { ServerOff } from "lucide-react";

interface ServerOption {
  id: string;
  label: string;
  value: string;
  is_active?: boolean;
}

interface ServerMenuProps {
  servers: ServerOption[];
  selectedServers: Set<string>;
  onServerSelect: (serverId: string) => void;
}

export const ServerMenu = ({
  servers,
  selectedServers,
  onServerSelect,
}: ServerMenuProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Servers</h3>
      <div className="flex flex-wrap gap-2">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => server.is_active && onServerSelect(server.value)}
            disabled={!server.is_active}
            className={cn(
              "px-4 py-2 rounded-lg text-sm transition-all duration-200",
              "border border-border",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "flex items-center gap-2",
              server.is_active ? (
                selectedServers.has(server.value)
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent hover:border-primary"
              ) : (
                "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              )
            )}
          >
            {!server.is_active && <ServerOff className="h-4 w-4" />}
            {server.label}
          </button>
        ))}
      </div>
    </div>
  );
};
