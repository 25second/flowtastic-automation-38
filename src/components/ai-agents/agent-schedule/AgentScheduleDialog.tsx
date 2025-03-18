
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Agent } from '@/hooks/ai-agents/types';
import { TaskNameField } from './components/TaskNameField';
import { BrowserTypeSelector } from './components/BrowserTypeSelector';
import { RunScheduleOptions } from './components/RunScheduleOptions';
import { ScheduleDatePicker } from './components/ScheduleDatePicker';
import { DesktopSelector } from './components/DesktopSelector';
import { useAgentSchedule } from './hooks/useAgentSchedule';
import { useLinkenSpherePort } from '@/hooks/useLinkenSpherePort';

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
  const {
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
    handleSubmit
  } = useAgentSchedule(agent, onStartAgent, open, onOpenChange);

  const { port } = useLinkenSpherePort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {agent ? `Schedule Task for ${agent.name}` : 'Schedule Agent Task'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <TaskNameField taskName={taskName} setTaskName={setTaskName} />
          
          <BrowserTypeSelector browserType={browserType} onBrowserTypeChange={setBrowserType} />
          
          <RunScheduleOptions 
            runImmediately={runImmediately} 
            onRunImmediatelyChange={setRunImmediately} 
          />
          
          {!runImmediately && (
            <ScheduleDatePicker
              startDate={startDate}
              startTime={startTime}
              onStartDateChange={setStartDate}
              onStartTimeChange={setStartTime}
            />
          )}

          {/* Desktop selector for LinkenSphere */}
          <DesktopSelector show={browserType === 'linkenSphere'} port={port} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!agent || !taskName.trim()}
          >
            {runImmediately ? 'Run Now' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
