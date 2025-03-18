
import { useState, useEffect } from 'react';
import { Agent } from '@/hooks/ai-agents/types';
import { toast } from 'sonner';

export type BrowserType = 'linkenSphere' | 'dolphin' | 'octoBrowser';

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
  
  // Session related states
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [loadingSessionActions, setLoadingSessionActions] = useState<Map<string, boolean>>(new Map());

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    } else if (agent) {
      setTaskName(`Task for ${agent.name}`);
      // If dialog opens and linkenSphere is selected, fetch sessions
      if (browserType === 'linkenSphere') {
        fetchSessions();
      }
    }
  }, [open, agent]);

  // Fetch sessions when browser type changes to linkenSphere
  useEffect(() => {
    if (open && browserType === 'linkenSphere') {
      fetchSessions();
    }
  }, [browserType, open]);

  const resetForm = () => {
    setTaskName('');
    setBrowserType('linkenSphere');
    setRunImmediately(true);
    setStartDate(null);
    setStartTime('');
    setSessions([]);
    setSelectedSessions(new Set());
    setSearchQuery('');
  };

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
    sessions: filteredSessions,
    loadingSessions,
    selectedSessions,
    handleSessionSelect,
    searchQuery,
    setSearchQuery,
    loadingSessionActions,
    isSessionActive,
    startSession,
    stopSession,
    handleSubmit,
    resetForm
  };
};
