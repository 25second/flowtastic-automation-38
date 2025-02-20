
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Server } from "@/types/server";
import { useEffect } from "react";
import { useServerManagement } from "@/hooks/useServerManagement";
import { Loader2 } from "lucide-react";

interface ServerSelectProps {
  servers: Server[];
  selectedServers: Set<string>;
  onServerSelect: (servers: Set<string>) => void;
}

export function ServerSelect({ servers, selectedServers, onServerSelect }: ServerSelectProps) {
  const { checkServerStatus } = useServerManagement();

  // Check all servers status when component mounts
  useEffect(() => {
    servers.forEach(server => {
      checkServerStatus(server);
    });
  }, [servers]); // Only run when servers list changes

  return (
    <div className="space-y-2">
      <Label>Select Servers</Label>
      <div className="flex flex-wrap gap-2">
        {servers.map((server) => (
          <Button
            key={server.id}
            type="button"
            variant={selectedServers.has(server.id) ? "default" : "outline"}
            onClick={() => {
              const newSelected = new Set(selectedServers);
              if (newSelected.has(server.id)) {
                newSelected.delete(server.id);
              } else {
                newSelected.add(server.id);
              }
              onServerSelect(newSelected);
            }}
            disabled={!server.is_active}
            className="relative"
          >
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              server.is_active ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={server.is_active ? 'text-foreground' : 'text-muted-foreground'}>
              {server.name || server.url}
            </span>
          </Button>
        ))}
        {servers.length === 0 && (
          <div className="text-muted-foreground text-sm">No servers available</div>
        )}
      </div>
    </div>
  );
}
