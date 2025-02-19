
import { cn } from "@/lib/utils";

interface ServerOption {
  id: string;
  label: string;
  value: string;
}

interface ServerMenuProps {
  servers: ServerOption[];
  selectedServer: string | null;
  onServerSelect: (serverId: string) => void;
}

export const ServerMenu = ({
  servers,
  selectedServer,
  onServerSelect,
}: ServerMenuProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Server</h3>
      <div className="flex flex-wrap gap-2">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => onServerSelect(server.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm transition-all duration-200",
              "border border-border hover:border-primary",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selectedServer === server.value
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent"
            )}
          >
            {server.label}
          </button>
        ))}
      </div>
    </div>
  );
};
