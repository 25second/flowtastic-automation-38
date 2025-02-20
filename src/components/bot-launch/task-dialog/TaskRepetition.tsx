
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
            <Label>Run every:</Label>
            <RadioGroup defaultValue="5min" className="grid gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5min" id="5min" />
                <Label htmlFor="5min" className="cursor-pointer">Every 5 minutes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30min" id="30min" />
                <Label htmlFor="30min" className="cursor-pointer">Every 30 minutes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1hour" id="1hour" />
                <Label htmlFor="1hour" className="cursor-pointer">Every hour</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6hours" id="6hours" />
                <Label htmlFor="6hours" className="cursor-pointer">Every 6 hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12hours" id="12hours" />
                <Label htmlFor="12hours" className="cursor-pointer">Every 12 hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24hours" id="24hours" />
                <Label htmlFor="24hours" className="cursor-pointer">Every 24 hours</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
}
