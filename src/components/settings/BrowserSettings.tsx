
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Linken Sphere API Port</Label>
        <Input
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="36912"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.browser.debugPorts')}</Label>
        <Input
          type="text"
          value={debugPorts}
          onChange={(e) => setDebugPorts(e.target.value)}
          placeholder="9222,9223,9224"
        />
      </div>
    </div>
  );
}
