
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Agent } from '@/hooks/ai-agents/types';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Clock, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrowserSessionsList } from '@/components/bot-launch/task-dialog/BrowserSessionsList';

type BrowserType = 'linkenSphere' | 'dolphin' | 'octoBrowser';

interface AgentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onStartAgent: (agentId: string) => void;
}

interface Session {
  name: string;
  status: string;
  uuid: string;
  proxy: {
    protocol: string;
    ip?: string;
    port?: string;
  };
}

export function AgentScheduleDialog({
  open,
  onOpenChange,
  agent,
  onStartAgent
}: AgentScheduleDialogProps) {
  const [taskName, setTaskName] = useState<string>('');
  const [browserType, setBrowserType] = useState<BrowserType>('linkenSphere');
  const [runImmediately, setRunImmediately] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  
  // Session related states
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [loadingSessionActions, setLoadingSessionActions] = useState<Map<string, boolean>>(new Map());
  
  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTaskName('');
      setBrowserType('linkenSphere');
      setRunImmediately(true);
      setStartDate(null);
      setStartTime('');
      setSessions([]);
      setSelectedSessions(new Set());
      setSearchQuery('');
    } else if (agent) {
      setTaskName(`Task for ${agent.name}`);
      // If dialog opens and linkenSphere is selected, fetch sessions
      if (browserType === 'linkenSphere') {
        fetchSessions();
      }
    }
    onOpenChange(open);
  };

  // Fetch sessions when browser type changes to linkenSphere
  useEffect(() => {
    if (open && browserType === 'linkenSphere') {
      fetchSessions();
    }
  }, [browserType, open]);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      // Get port from localStorage
      const port = localStorage.getItem('linkenSpherePort') || '36912';
      const response = await fetch(`http://127.0.0.1:${port}/sessions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      
      const data = await response.json();
      setSessions(data);
      setLoadingSessions(false);
    } catch (error) {
      console.error('Error fetching LinkenSphere sessions:', error);
      toast.error('Failed to fetch LinkenSphere sessions');
      setSessions([]);
      setLoadingSessions(false);
    }
  };

  const handleSessionSelect = (newSelectedSessions: Set<string>) => {
    setSelectedSessions(newSelectedSessions);
  };

  const isSessionActive = (status: string) => {
    return status === 'running' || status === 'automationRunning';
  };

  const startSession = (id: string) => {
    // Placeholder for starting session
    console.log('Starting session:', id);
  };

  const stopSession = (id: string) => {
    // Placeholder for stopping session
    console.log('Stopping session:', id);
  };

  const handleSubmit = () => {
    if (!agent) return;
    
    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    
    if (browserType === 'linkenSphere' && selectedSessions.size === 0) {
      toast.error('Please select at least one LinkenSphere session');
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
      
      toast.success(`Task "${taskName}" with ${browserType} scheduled for ${format(scheduledTime, 'PPpp')}`);
      onOpenChange(false);
      return;
    }
    
    // If running immediately, call the onStartAgent function
    toast.success(`Starting agent with ${browserType}: ${taskName}`);
    onStartAgent(agent.id);
    onOpenChange(false);
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {agent ? `Schedule Task for ${agent.name}` : 'Schedule Agent Task'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter a name for this task"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="browserType">Browser Type</Label>
            <Select value={browserType} onValueChange={(value) => setBrowserType(value as BrowserType)}>
              <SelectTrigger id="browserType">
                <SelectValue placeholder="Select browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkenSphere">Linken Sphere</SelectItem>
                <SelectItem value="dolphin">Dolphin Anty</SelectItem>
                <SelectItem value="octoBrowser">Octo Browser</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {browserType === 'linkenSphere' && (
            <div className="space-y-2">
              {loadingSessions ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading sessions...</span>
                </div>
              ) : (
                <BrowserSessionsList
                  sessions={filteredSessions}
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
