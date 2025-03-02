
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from '@/hooks/useAdminStats';

interface DateRangePickerProps {
  dateRange: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRangeFilter>(dateRange);

  // When external dateRange changes, update local state
  useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  const handleSelect = (date: Date | undefined) => {
    const { startDate, endDate } = tempDateRange;
    
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set start date
      setTempDateRange({
        startDate: date,
        endDate: undefined
      });
    } else {
      // If only start date is selected and the selected date is after start date
      if (date && date >= startDate) {
        setTempDateRange({
          startDate,
          endDate: date
        });
        
        // Both dates selected, close the popover and apply the filter
        onChange({
          startDate,
          endDate: date
        });
        setTimeout(() => setIsOpen(false), 300);
      } else {
        // If selected date is before start date, reset and use it as start date
        setTempDateRange({
          startDate: date,
          endDate: undefined
        });
      }
    }
  };

  const formatDisplayText = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${format(dateRange.startDate, "MMM d, yyyy")} - ${format(dateRange.endDate, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between gap-2 w-[260px]"
        >
          <span>{formatDisplayText()}</span>
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={{
            from: tempDateRange.startDate || undefined,
            to: tempDateRange.endDate || undefined,
          }}
          onSelect={(range) => {
            handleSelect(range?.from);
            handleSelect(range?.to);
          }}
          defaultMonth={tempDateRange.startDate || new Date()}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-between p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(today.getMonth() - 6);
              
              const newRange = {
                startDate: sixMonthsAgo,
                endDate: today
              };
              
              setTempDateRange(newRange);
              onChange(newRange);
              setIsOpen(false);
            }}
          >
            Last 6 Months
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (tempDateRange.startDate && tempDateRange.endDate) {
                onChange(tempDateRange);
              }
              setIsOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
