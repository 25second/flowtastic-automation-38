
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface Session {
  name: string;
  status: string;
  uuid: string;
  id: string;
  proxy: {
    protocol: string;
    ip?: string;
    port?: string;
  };
  debug_port?: number;
}

export const validateScheduleData = (
  taskName: string, 
  browserType: string, 
  runImmediately: boolean,
  startDate: Date | null,
  startTime: string
): string | null => {
  if (!taskName.trim()) {
    return 'Please enter a task name';
  }
  
  if (!runImmediately && (!startDate || !startTime)) {
    return 'Please select both date and time for scheduled execution';
  }
  
  return null;
};

export const formatScheduledTime = (startDate: Date, startTime: string): string => {
  try {
    const dateString = format(startDate, 'yyyy-MM-dd');
    const scheduledTime = new Date(`${dateString}T${startTime}`);
    return format(scheduledTime, 'PPpp');
  } catch (error) {
    console.error('Error formatting scheduled time:', error);
    return `${startDate.toDateString()} at ${startTime}`;
  }
};
