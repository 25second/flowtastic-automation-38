
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Label className="flex-grow">Run Multiple Times</Label>
        <Switch
          checked={runMultiple}
          onCheckedChange={onRunMultipleChange}
        />
      </div>

      {runMultiple && (
        <div className="space-y-2">
          <Label>Run every:</Label>
          <Select defaultValue="5min">
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5min">Every 5 minutes</SelectItem>
              <SelectItem value="30min">Every 30 minutes</SelectItem>
              <SelectItem value="1hour">Every hour</SelectItem>
              <SelectItem value="6hours">Every 6 hours</SelectItem>
              <SelectItem value="12hours">Every 12 hours</SelectItem>
              <SelectItem value="24hours">Every 24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
