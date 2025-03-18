
import { useState, useEffect } from 'react';
import { Agent } from '@/hooks/ai-agents/types';
import { toast } from 'sonner';
import { 
  validateScheduleData,
  formatScheduledTime
} from '../services/linkenSphereService';

export type BrowserType = 'linkenSphere' | 'dolphin' | 'octoBrowser';

export const useAgentSchedule = (
  agent: Agent | null,
  onStartAgent: (agentId: string) => void,
  open: boolean,
  onOpenChange: (open: boolean) => void
) => {
  // Form state
  const [taskName, setTaskName] = useState<string>('');
  const [browserType, setBrowserType] = useState<BrowserType>('linkenSphere');
  const [runImmediately, setRunImmediately] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    } else if (agent) {
      setTaskName(`Task for ${agent.name}`);
    }
  }, [open, agent]);

  const resetForm = () => {
    setTaskName('');
    setBrowserType('linkenSphere');
    setRunImmediately(true);
    setStartDate(null);
    setStartTime('');
  };

  const handleSubmit = () => {
    if (!agent) return;
    
    // Validate required fields
    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    
    // If scheduled, validate date and time
    if (!runImmediately && (!startDate || !startTime)) {
      toast.error('Please select both date and time for scheduled execution');
      return;
    }
    
    // If scheduled, you could store this in the database
    if (!runImmediately && startDate && startTime) {
      const formattedTime = formatScheduledTime(startDate, startTime);
      
      toast.success(`Task "${taskName}" with ${browserType} scheduled for ${formattedTime}`);
      onOpenChange(false);
      return;
    }
    
    // If running immediately, call the onStartAgent function
    toast.success(`Starting agent with ${browserType}: ${taskName}`);
    onStartAgent(agent.id);
    onOpenChange(false);
  };

  return {
    taskName,
    setTaskName,
    browserType,
    setBrowserType,
    runImmediately,
    setRunImmediately,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    handleSubmit,
    resetForm
  };
};
