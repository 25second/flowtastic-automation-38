
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Server } from "@/types/server";

interface ServerSelectProps {
  servers: Server[];
  selectedServers: Set<string>;
  onServerSelect: (servers: Set<string>) => void;
}

export function ServerSelect({ servers, selectedServers, onServerSelect }: ServerSelectProps) {
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
          >
            {server.name || server.url}
          </Button>
        ))}
      </div>
    </div>
  );
}
