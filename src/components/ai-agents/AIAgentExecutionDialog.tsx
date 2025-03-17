
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Circle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Agent } from '@/hooks/ai-agents/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useAgentExecution } from '@/hooks/ai-agents/useAgentExecution';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [scheduleExecution, setScheduleExecution] = useState(false);
  
  useEffect(() => {
    if (!open) {
      setTaskName('');
      setSelectedBrowser(null);
      setSelectedSession(null);
      setSessions([]);
      setExecutionResult(null);
      setIsExecuting(false);
      setDate(null);
      setTime('');
      setScheduleExecution(false);
    } else if (agent) {
      setTaskName(agent.task_description || '');
    }
  }, [open, agent]);
  
  const { executeAgent, stopAgent, isExecuting: checkAgentRunning } = useAgentExecution();
  
  useEffect(() => {
    if (agent) {
      setIsExecuting(checkAgentRunning(agent.id));
    }
  }, [agent, checkAgentRunning]);
  
  const handleStartAgent = async () => {
    if (!agent || !selectedSession) return;
    
    if (scheduleExecution && date && time) {
      // Handle scheduled execution
      const scheduledTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
      
      if (scheduledTime <= new Date()) {
        alert(t('agents.schedule_time_in_past'));
        return;
      }
      
      // TODO: Implement scheduled execution logic
      console.log(`Task scheduled for ${scheduledTime.toISOString()}`);
      alert(t('agents.task_scheduled'));
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
  
  const fetchSessions = async (browserType: string) => {
    setLoadingSessions(true);
    setSessions([]);
    setSelectedSession(null);
    
    try {
      let sessionsData: any[] = [];
      
      if (browserType === 'linkenSphere') {
        const response = await fetch('http://localhost:3001/linken-sphere/sessions?port=40080');
        if (!response.ok) {
          throw new Error(`Error fetching LinkenSphere sessions: ${response.statusText}`);
        }
        sessionsData = await response.json();
        sessionsData = sessionsData.map(session => ({
          id: session.uuid,
          name: session.name,
          status: session.status
        }));
      } else if (browserType === 'dolphin') {
        // Mock data for now, replace with actual API call
        sessionsData = [
          { id: 'dolphin1', name: 'Dolphin Profile 1', status: 'running' },
          { id: 'dolphin2', name: 'Dolphin Profile 2', status: 'stopped' }
        ];
      } else if (browserType === 'octo') {
        // Mock data for now, replace with actual API call
        sessionsData = [
          { id: 'octo1', name: 'Octo Profile 1', status: 'running' },
          { id: 'octo2', name: 'Octo Profile 2', status: 'stopped' }
        ];
      } else if (browserType === 'morelogin') {
        // Mock data for now, replace with actual API call
        sessionsData = [
          { id: 'more1', name: 'Morelogin Profile 1', status: 'running' },
          { id: 'more2', name: 'Morelogin Profile 2', status: 'stopped' }
        ];
      }
      
      setSessions(sessionsData);
    } catch (error) {
      console.error(`Error fetching ${browserType} sessions:`, error);
    } finally {
      setLoadingSessions(false);
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
            {t('agents.execute')} {agent?.name}
          </DialogTitle>
          <DialogDescription>
            {agent?.description || t('agents.execute_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-name">{t('agents.task_name')}</Label>
            <Input 
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t('agents.task_name_placeholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="browser-select">{t('agents.select_browser')}</Label>
            <Select 
              onValueChange={(value) => {
                setSelectedBrowser(value);
                fetchSessions(value);
              }}
              value={selectedBrowser || ''}
            >
              <SelectTrigger id="browser-select">
                <SelectValue placeholder={t('agents.select_browser_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkenSphere">Linken Sphere</SelectItem>
                <SelectItem value="dolphin">Dolphin (Anty)</SelectItem>
                <SelectItem value="octo">Octo Browser</SelectItem>
                <SelectItem value="morelogin">Morelogin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedBrowser && (
            <div className="space-y-2">
              <Label>{t('agents.select_session')}</Label>
              {loadingSessions ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t('agents.no_sessions_found')}
                </div>
              ) : (
                <ScrollArea className="h-60 border rounded-md p-2">
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div 
                        key={session.id}
                        className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                          selectedSession === session.id ? 'border-primary bg-accent/50' : ''
                        }`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          session.status === 'running' || session.status === 'automationRunning' 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-xs text-muted-foreground">Status: {session.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="schedule-execution" 
                checked={scheduleExecution}
                onChange={(e) => setScheduleExecution(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="schedule-execution">{t('agents.schedule_execution')}</Label>
            </div>
            
            {scheduleExecution && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>{t('agents.select_date')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>{t('agents.pick_date')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-input">{t('agents.select_time')}</Label>
                  <Input
                    id="time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {executionResult && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('agents.execution_result')}</h3>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {executionResult.steps?.map((step: any, index: number) => (
                    <div key={step.id} className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {step.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                        {step.status === 'pending' && <Circle className="h-4 w-4 text-gray-400" />}
                        {step.status === 'in_progress' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                        <span className="font-medium">Step {index + 1}</span>
                      </div>
                      <p className="text-sm">{step.description}</p>
                      {step.result && (
                        <div className="mt-2 p-2 text-xs bg-accent/50 rounded-md">
                          {step.result}
                        </div>
                      )}
                      {step.screenshot && (
                        <div className="mt-2">
                          <img 
                            src={`/storage/screenshots/${step.screenshot}`} 
                            alt={`Step ${index + 1} screenshot`}
                            className="max-w-full rounded border"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              {t('common.close')}
            </Button>
            
            {isExecuting ? (
              <Button 
                variant="destructive" 
                onClick={handleStopAgent}
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('agents.stop_execution')}
              </Button>
            ) : (
              <Button 
                onClick={handleStartAgent}
                disabled={!selectedSession || 
                  (scheduleExecution && (!date || !time))}
              >
                <Bot className="h-4 w-4 mr-2" />
                {scheduleExecution ? t('agents.schedule') : t('agents.start_execution')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
