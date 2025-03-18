
import { useState, useEffect } from 'react';
import { Agent } from '@/hooks/ai-agents/types';
import { toast } from 'sonner';
import { 
  fetchSessions, 
  startSession as startLinkenSphereSession, 
  stopSession as stopLinkenSphereSession, 
  isSessionActive as checkSessionActive,
  validateScheduleData,
  formatScheduledTime,
  Session
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
        fetchSessionsData();
      }
    }
  }, [open, agent]);

  // Fetch sessions when browser type changes to linkenSphere
  useEffect(() => {
    if (open && browserType === 'linkenSphere') {
      fetchSessionsData();
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

  const fetchSessionsData = async () => {
    try {
      setLoadingSessions(true);
      const sessionsData = await fetchSessions();
      setSessions(sessionsData);
      setLoadingSessions(false);
    } catch (error) {
      setLoadingSessions(false);
    }
  };

  // Modified to always set a new set with just one session ID
  const handleSessionSelect = (newSelectedSessions: Set<string>) => {
    setSelectedSessions(newSelectedSessions);
  };

  const handleSubmit = () => {
    if (!agent) return;
    
    const validationError = validateScheduleData(
      taskName, 
      browserType, 
      selectedSessions, 
      runImmediately,
      startDate,
      startTime
    );
    
    if (validationError) {
      toast.error(validationError);
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
    isSessionActive: checkSessionActive,
    startSession: startLinkenSphereSession,
    stopSession: stopLinkenSphereSession,
    handleSubmit,
    resetForm
  };
};
