
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
      <div className="flex items-center justify-between">
        <Label>Run Time</Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={runImmediately}
            onCheckedChange={onRunImmediatelyChange}
          />
          <span>Run Immediately</span>
        </div>
      </div>

      {!runImmediately && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Server Time</Label>
            <p className="text-sm text-muted-foreground">{serverTime}</p>
          </div>
          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  className="rounded-md border"
                />
              </div>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
