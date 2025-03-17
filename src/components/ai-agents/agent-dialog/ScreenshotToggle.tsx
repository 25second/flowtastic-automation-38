
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';

interface ScreenshotToggleProps {
  takeScreenshots: boolean;
  setTakeScreenshots: (value: boolean) => void;
}

export function ScreenshotToggle({ takeScreenshots, setTakeScreenshots }: ScreenshotToggleProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-primary/10">
      <div className="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        <Camera className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <Label htmlFor="screenshots" className="font-medium cursor-pointer">
          Записывать скриншоты во время выполнения
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Помогает отслеживать действия агента
        </p>
      </div>
      <Switch
        id="screenshots"
        checked={takeScreenshots}
        onCheckedChange={setTakeScreenshots}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
