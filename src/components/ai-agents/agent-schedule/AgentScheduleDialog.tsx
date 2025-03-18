import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Agent } from '@/hooks/ai-agents/types';
import { Loader2 } from 'lucide-react';
import { BrowserSessionsList } from '@/components/bot-launch/task-dialog/BrowserSessionsList';
import { TaskNameField } from './components/TaskNameField';
import { BrowserTypeSelector } from './components/BrowserTypeSelector';
import { RunScheduleOptions } from './components/RunScheduleOptions';
import { ScheduleDatePicker } from './components/ScheduleDatePicker';
import { useAgentSchedule } from './hooks/useAgentSchedule';

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
    sessions,
    loadingSessions,
    selectedSessions,
    handleSessionSelect,
    searchQuery,
    setSearchQuery,
    loadingSessionActions,
    isSessionActive,
    startSession,
    stopSession,
    handleSubmit
  } = useAgentSchedule(agent, onStartAgent, open, onOpenChange);

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
          
          {browserType === 'linkenSphere' && (
            <div className="space-y-2">
              {loadingSessions ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading sessions...</span>
                </div>
              ) : (
                <BrowserSessionsList
                  sessions={sessions}
                  selectedSessions={selectedSessions}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSessionSelect={handleSessionSelect}
                  isSessionActive={isSessionActive}
                  loadingSessions={loadingSessionActions}
                  onStartSession={startSession}
                  onStopSession={stopSession}
                  selectedServers={new Set()}
                />
              )}
            </div>
          )}
          
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={
              !agent || 
              !taskName.trim() || 
              (browserType === 'linkenSphere' && selectedSessions.size === 0)
            }
          >
            {runImmediately ? 'Run Now' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
