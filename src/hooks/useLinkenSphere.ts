
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LinkenSphereSession {
  id: string;
  name: string;
  status: string;
  debug_port?: number;
}

export const useLinkenSphere = () => {
  const [sessions, setSessions] = useState<LinkenSphereSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSessions = async () => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching Linken Sphere sessions:', error);
      toast.error('Failed to fetch Linken Sphere sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (sessionId: string) => {
    const port = localStorage.getItem('linkenSpherePort') || '40080';
    const debugPort = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111;

    try {
      console.log('Starting session with payload:', {
        debug_port: debugPort,
        uuid: sessionId
      });
      
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions/start?port=${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debug_port: debugPort,
          uuid: sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start session');
      }
      
      const data = await response.json();
      setSessions(sessions.map(session => 
        session.id === sessionId 
          ? { ...session, debug_port: data.port || debugPort }
          : session
      ));
      
      toast.success(`Session started on port ${data.port || debugPort}`);
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
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
    startSession
  };
};
