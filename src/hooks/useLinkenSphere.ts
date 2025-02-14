
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LinkenSphereSession {
  id: string;
  uuid: string;
  name: string;
  status: string;
  debug_port?: number;
}

export const useLinkenSphere = () => {
  const [sessions, setSessions] = useState<LinkenSphereSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const generateDebugPort = () => {
    return Math.floor(Math.random() * (65535 - 32000 + 1)) + 32000;
  };

  const fetchSessions = async () => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      const sessionsWithUuid = data.map((session: any) => ({
        ...session,
        id: session.id || session.uuid,
        uuid: session.uuid,
        debug_port: session.debug_port
      }));
      setSessions(sessionsWithUuid);
    } catch (error) {
      console.error('Error fetching Linken Sphere sessions:', error);
      toast.error('Failed to fetch Linken Sphere sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const startSelectedSessions = async () => {
    for (const sessionId of selectedSessions) {
      await startSession(sessionId);
    }
  };

  const stopSelectedSessions = async () => {
    for (const sessionId of selectedSessions) {
      await stopSession(sessionId);
    }
  };

  const startSession = async (sessionId: string) => {
    const debugPort = generateDebugPort();
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found');
      toast.error('Session not found');
      return;
    }

    try {
      console.log('Starting session with payload:', {
        uuid: session.uuid,
        headless: false,
        debug_port: debugPort
      });
      
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/start?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.uuid,
          headless: false,
          debug_port: debugPort
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to start session');
      }
      
      const data = await response.json();
      console.log('Start session response:', data);
      
      setSessions(sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'running', debug_port: data.port || debugPort }
          : s
      ));
      
      toast.success(`Session started on port ${data.port || debugPort}`);
      await fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    }
  };

  const stopSession = async (sessionId: string) => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found');
      toast.error('Session not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/stop?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: session.uuid
        }),
      });

      const responseText = await response.text();
      console.log('Stop session response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to stop session: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }

      setSessions(sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'stopped', debug_port: undefined }
          : s
      ));
      
      toast.success('Session stopped successfully');
      await fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
      toast.error('Failed to stop session');
    }
  };

  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(sessionId)) {
        newSelected.delete(sessionId);
      } else {
        newSelected.add(sessionId);
      }
      return newSelected;
    });
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    sessions: filteredSessions,
    loading,
    selectedSessions,
    toggleSession,
    searchQuery,
    setSearchQuery,
    fetchSessions,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions
  };
};
