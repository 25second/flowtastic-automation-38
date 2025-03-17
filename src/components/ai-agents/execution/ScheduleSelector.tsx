
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ScheduleSelectorProps {
  scheduleExecution: boolean;
  onScheduleChange: (enabled: boolean) => void;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

export function ScheduleSelector({
  scheduleExecution,
  onScheduleChange,
  date,
  onDateChange,
  time,
  onTimeChange
}: ScheduleSelectorProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="schedule-execution" 
          checked={scheduleExecution}
          onChange={(e) => onScheduleChange(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="schedule-execution">{t('agents.schedule_execution') || 'Schedule execution'}</Label>
      </div>
      
      {scheduleExecution && (
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="space-y-2">
            <Label>{t('agents.select_date') || 'Select date'}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : <span>{t('agents.pick_date') || 'Pick a date'}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-input">{t('agents.select_time') || 'Select time'}</Label>
            <Input
              id="time-input"
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
