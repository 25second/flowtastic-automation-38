
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ScheduleDatePickerProps {
  startDate: Date | null;
  startTime: string;
  onStartDateChange: (date: Date | null) => void;
  onStartTimeChange: (time: string) => void;
}

export function ScheduleDatePicker({
  startDate,
  startTime,
  onStartDateChange,
  onStartTimeChange
}: ScheduleDatePickerProps) {
  return (
    <div className="space-y-2">
      <Label>Schedule Date & Time</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarDays className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'PP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <div className="relative w-full">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="pl-10"
          />
          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
