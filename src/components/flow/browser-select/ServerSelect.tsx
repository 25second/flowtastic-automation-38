
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServerOption {
  id: string;
  label: string;
  value: string;
}

interface ServerSelectProps {
  serverOptions: ServerOption[];
  selectedServer: string | null;
  setSelectedServer: (server: string) => void;
}

export const ServerSelect = ({
  serverOptions,
  selectedServer,
  setSelectedServer,
}: ServerSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Server</label>
      <Select
        value={selectedServer || undefined}
        onValueChange={setSelectedServer}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select server" />
        </SelectTrigger>
        <SelectContent>
          {serverOptions.map((server) => (
            <SelectItem key={server.id} value={server.value}>
              {server.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
