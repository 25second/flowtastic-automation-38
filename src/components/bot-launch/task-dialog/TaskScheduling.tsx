
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";

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
  const formattedDateTime = startDate 
    ? `${format(startDate, 'PP')} at ${startTime}`
    : 'Click to set date and time';

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

      {!runImmediately && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center"
            >
              <span className={!startDate ? "text-muted-foreground" : ""}>
                {formattedDateTime}
              </span>
              <CalendarDays className="h-4 w-4 opacity-50" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Set Start Date and Time</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  className="rounded-md border mx-auto"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => onStartTimeChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
