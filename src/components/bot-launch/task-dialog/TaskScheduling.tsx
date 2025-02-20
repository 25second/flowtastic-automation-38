
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface TaskSchedulingProps {
  runImmediately: boolean;
  onRunImmediatelyChange: (value: boolean) => void;
  serverTime: string;
  startDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  startTime: string;
  onStartTimeChange: (time: string) => void;
}

export function TaskScheduling({
  runImmediately,
  onRunImmediatelyChange,
  serverTime,
  startDate,
  onStartDateChange,
  startTime,
  onStartTimeChange
}: TaskSchedulingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <Label>Run Time</Label>
          <Switch
            checked={!runImmediately}
            onCheckedChange={(checked) => onRunImmediatelyChange(!checked)}
          />
          <span className="text-sm text-muted-foreground">
            Server Time: {serverTime}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={runImmediately ? 'text-muted-foreground' : ''}>Start Date</Label>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            className="rounded-md border"
            disabled={runImmediately}
          />
        </div>
        <div className="space-y-2">
          <Label className={runImmediately ? 'text-muted-foreground' : ''}>Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full"
            disabled={runImmediately}
          />
        </div>
      </div>
    </div>
  );
}
