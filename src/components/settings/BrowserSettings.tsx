
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BrowserSettingsProps {
  port: string;
  setPort: (value: string) => void;
  debugPorts: string;
  setDebugPorts: (value: string) => void;
}

export function BrowserSettings({
  port,
  setPort,
  debugPorts,
  setDebugPorts
}: BrowserSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Linken Sphere API Port</Label>
        <Input
          id="port"
          type="number"
          placeholder="Enter port number"
          value={port}
          onChange={e => setPort(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Chrome Debug Ports</Label>
        <Textarea
          id="debugPorts"
          placeholder="Enter ports separated by comma (e.g.: 9222,9223,9224)"
          value={debugPorts}
          onChange={e => setDebugPorts(e.target.value)}
          className="w-full min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground">
          Specify ports separated by commas for Chrome debugging
        </p>
      </div>
    </div>
  );
}
