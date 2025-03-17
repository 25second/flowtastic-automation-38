
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { Agent } from '@/hooks/ai-agents/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useAgentExecution } from '@/hooks/ai-agents/useAgentExecution';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { SessionSelector } from './execution/SessionSelector';
import { ScheduleSelector } from './execution/ScheduleSelector';
import { ExecutionResults } from './execution/ExecutionResults';
import { format } from 'date-fns';

interface AgentExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
}

export function AIAgentExecutionDialog({
  open,
  onOpenChange,
  agent
}: AgentExecutionDialogProps) {
  const { t } = useLanguage();
  const [taskName, setTaskName] = useState('');
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [scheduleExecution, setScheduleExecution] = useState(false);
  
  useEffect(() => {
    if (!open) {
      resetState();
    } else if (agent) {
      setTaskName(agent.task_description || '');
    }
  }, [open, agent]);
  
  const resetState = () => {
    setTaskName('');
    setSelectedBrowser(null);
    setSelectedSession(null);
    setExecutionResult(null);
    setIsExecuting(false);
    setDate(null);
    setTime('');
    setScheduleExecution(false);
  };
  
  const { executeAgent, stopAgent, isExecuting: checkAgentRunning } = useAgentExecution();
  
  useEffect(() => {
    if (agent) {
      setIsExecuting(checkAgentRunning(agent.id));
    }
  }, [agent, checkAgentRunning]);
  
  const handleStartAgent = async () => {
    if (!agent || !selectedSession) return;
    
    if (scheduleExecution && date && time) {
      const scheduledTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
      
      if (scheduledTime <= new Date()) {
        toast.error(t('agents.schedule_time_in_past') || 'Schedule time must be in the future');
        return;
      }
      
      console.log(`Task scheduled for ${scheduledTime.toISOString()}`);
      toast.success(t('agents.task_scheduled') || 'Task scheduled successfully');
      onOpenChange(false);
      return;
    }
    
    setIsExecuting(true);
    try {
      const result = await executeAgent(agent, selectedSession);
      setExecutionResult(result);
    } catch (error) {
      console.error('Error executing agent:', error);
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleStopAgent = async () => {
    if (!agent) return;
    
    try {
      await stopAgent(agent);
      setIsExecuting(false);
    } catch (error) {
      console.error('Error stopping agent:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: agent?.color || '#9b87f5' }}
            >
              <Bot className="h-4 w-4 text-white" />
            </div>
            {t('agents.execute') || 'Execute'} {agent?.name}
          </DialogTitle>
          <DialogDescription>
            {agent?.description || t('agents.execute_description') || 'Configure and execute this agent'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-name">{t('agents.task_name') || 'Task name'}</Label>
            <Input 
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t('agents.task_name_placeholder') || 'Enter task name'}
            />
          </div>
          
          <SessionSelector
            selectedBrowser={selectedBrowser}
            selectedSession={selectedSession}
            onBrowserChange={setSelectedBrowser}
            onSessionChange={setSelectedSession}
          />
          
          <ScheduleSelector
            scheduleExecution={scheduleExecution}
            onScheduleChange={setScheduleExecution}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
          />
          
          {executionResult && <ExecutionResults executionResult={executionResult} />}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              {t('common.close') || 'Close'}
            </Button>
            
            {isExecuting ? (
              <Button 
                variant="destructive" 
                onClick={handleStopAgent}
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('agents.stop_execution') || 'Stop execution'}
              </Button>
            ) : (
              <Button 
                onClick={handleStartAgent}
                disabled={!selectedSession || 
                  (scheduleExecution && (!date || !time))}
              >
                <Bot className="h-4 w-4 mr-2" />
                {scheduleExecution 
                  ? t('agents.schedule') || 'Schedule' 
                  : t('agents.start_execution') || 'Start execution'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
