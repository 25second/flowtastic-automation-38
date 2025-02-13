
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LinkenSphereSession {
  id: string;
  name: string;
  status: string;
}

export const useLinkenSphere = () => {
  const [sessions, setSessions] = useState<LinkenSphereSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

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

  return {
    sessions,
    loading,
    selectedSession,
    setSelectedSession,
    fetchSessions
  };
};
