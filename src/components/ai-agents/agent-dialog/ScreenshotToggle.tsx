
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ScreenshotToggleProps {
  takeScreenshots: boolean;
  setTakeScreenshots: (value: boolean) => void;
}

export function ScreenshotToggle({ takeScreenshots, setTakeScreenshots }: ScreenshotToggleProps) {
  return (
    <div className="flex items-center space-x-3 mt-1">
      <Switch
        id="screenshots"
        checked={takeScreenshots}
        onCheckedChange={setTakeScreenshots}
        className="data-[state=checked]:bg-primary"
      />
      <Label htmlFor="screenshots" className="font-medium cursor-pointer">
        Записывать скриншоты во время выполнения
      </Label>
    </div>
  );
}
