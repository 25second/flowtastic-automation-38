
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface RunScheduleOptionsProps {
  runImmediately: boolean;
  onRunImmediatelyChange: (value: boolean) => void;
}

export function RunScheduleOptions({ runImmediately, onRunImmediatelyChange }: RunScheduleOptionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="runNow"
        checked={runImmediately}
        onCheckedChange={onRunImmediatelyChange}
      />
      <Label htmlFor="runNow">Run immediately</Label>
    </div>
  );
}
