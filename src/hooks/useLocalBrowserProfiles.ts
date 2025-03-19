
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLinkenSpherePort } from '@/hooks/useLinkenSpherePort';

export interface BrowserProfile {
  id: string;
  uuid: string;
  name: string;
  status: string;
  debug_port?: number;
}

export function useLocalBrowserProfiles() {
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { port } = useLinkenSpherePort();

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<BrowserProfile[]>(`http://127.0.0.1:${port}/sessions`);
      
      // Transform the response data to include id if it's missing
      const transformedProfiles = response.data.map(profile => ({
        ...profile,
        id: profile.id || profile.uuid // Ensure we have an id field
      }));
      
      setProfiles(transformedProfiles);
      return transformedProfiles;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch browser profiles';
      setError(errorMessage);
      toast.error(`Error fetching profiles: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch profiles on initial load
  useEffect(() => {
    if (port) {
      fetchProfiles();
    }
  }, [port]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
  };
}
