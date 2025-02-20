
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface TaskRepetitionProps {
  runMultiple: boolean;
  onRunMultipleChange: (value: boolean) => void;
  repeatCount: number;
  onRepeatCountChange: (value: number) => void;
}

export function TaskRepetition({
  runMultiple,
  onRunMultipleChange,
  repeatCount,
  onRepeatCountChange
}: TaskRepetitionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Run Multiple Times</Label>
        <Switch
          checked={runMultiple}
          onCheckedChange={onRunMultipleChange}
        />
      </div>

      {runMultiple && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Number of Repetitions</Label>
            <Input
              type="number"
              min="1"
              value={repeatCount}
              onChange={(e) => onRepeatCountChange(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Interval Between Runs</Label>
            <Input
              type="time"
              step="300"
              min="00:05"
              defaultValue="00:05"
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
