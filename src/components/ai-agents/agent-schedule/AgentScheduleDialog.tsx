
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
import { useLocalBrowserProfiles } from '@/hooks/useLocalBrowserProfiles';
import { Loader2 } from 'lucide-react';

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
  const { profiles, loading: loadingProfiles, error, activeDesktop } = useLocalBrowserProfiles();

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
          
          {/* Desktop selector for LinkenSphere */}
          <DesktopSelector show={browserType === 'linkenSphere'} port={port} />
          
          {/* Display profiles if LinkenSphere browser type is selected */}
          {browserType === 'linkenSphere' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Browser Profiles</h3>
              {loadingProfiles ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              ) : profiles.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${profile.status === 'running' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="font-medium">{profile.name || `Profile ${profile.id.substring(0, 6)}`}</span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{profile.status}</span>
                    </div>
                  ))}
                </div>
              ) : activeDesktop ? (
                <p className="text-sm text-muted-foreground">No browser profiles available for this desktop</p>
              ) : (
                <p className="text-sm text-muted-foreground">Please select a desktop to view profiles</p>
              )}
            </div>
          )}
          
          {/* Moved RunScheduleOptions to after DesktopSelector */}
          <RunScheduleOptions 
            runImmediately={runImmediately} 
            onRunImmediatelyChange={setRunImmediately} 
          />

          {/* Schedule Date Picker moved to the bottom */}
          {!runImmediately && (
            <ScheduleDatePicker
              startDate={startDate}
              startTime={startTime}
              onStartDateChange={setStartDate}
              onStartTimeChange={setStartTime}
            />
          )}
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
