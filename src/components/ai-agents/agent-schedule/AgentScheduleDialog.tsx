
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Agent } from '@/hooks/ai-agents/types';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AgentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onStartAgent: (agentId: string) => void;
}

export function AgentScheduleDialog({
  open,
  onOpenChange,
  agent,
  onStartAgent
}: AgentScheduleDialogProps) {
  const [taskName, setTaskName] = useState<string>('');
  const [runImmediately, setRunImmediately] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  
  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTaskName('');
      setRunImmediately(true);
      setStartDate(null);
      setStartTime('');
    } else if (agent) {
      setTaskName(`Task for ${agent.name}`);
    }
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (!agent) return;
    
    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    
    if (!runImmediately && (!startDate || !startTime)) {
      toast.error('Please select both date and time for scheduled execution');
      return;
    }
    
    // If scheduled, you could store this in the database
    if (!runImmediately && startDate && startTime) {
      const scheduledTime = new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
      // Here you would typically save the scheduled task to the database
      
      toast.success(`Task "${taskName}" scheduled for ${format(scheduledTime, 'PPpp')}`);
      onOpenChange(false);
      return;
    }
    
    // If running immediately, call the onStartAgent function
    toast.success(`Starting agent: ${taskName}`);
    onStartAgent(agent.id);
    onOpenChange(false);
  };

  const formattedDateTime = startDate 
    ? `${format(startDate, 'PP')} at ${startTime || 'HH:MM'}`
    : 'Click to set date and time';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {agent ? `Schedule Task for ${agent.name}` : 'Schedule Agent Task'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter a name for this task"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="runNow"
              checked={runImmediately}
              onCheckedChange={setRunImmediately}
            />
            <Label htmlFor="runNow">Run immediately</Label>
          </div>
          
          {!runImmediately && (
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
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="relative w-full">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!agent || !taskName.trim()}>
            {runImmediately ? 'Run Now' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
