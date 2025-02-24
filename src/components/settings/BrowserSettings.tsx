
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="port">API порт Linken Sphere</Label>
        <Input
          id="port"
          type="number"
          placeholder="Введите порт"
          value={port}
          onChange={e => setPort(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="debugPorts">Chrome Debug порты</Label>
        <Textarea
          id="debugPorts"
          placeholder="Введите порты через запятую (например: 9222,9223,9224)"
          value={debugPorts}
          onChange={e => setDebugPorts(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Укажите порты через запятую для отладки Chrome
        </p>
      </div>
    </div>
  );
}
