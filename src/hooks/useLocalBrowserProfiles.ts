
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
  const [activeDesktop, setActiveDesktop] = useState<string | null>(null);

  const fetchProfiles = async () => {
    if (!port) {
      toast.error('LinkenSphere port is not configured');
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching profiles from port ${port}`);
      
      // Simple direct request to the local LinkenSphere service
      const url = `http://127.0.0.1:${port}/sessions`;
      
      const response = await axios.get<BrowserProfile[]>(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      
      console.log('Profiles response:', response.data);
      
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
      console.error('Error fetching profiles:', err);
      toast.error(`Error fetching profiles: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Update active desktop and refresh profiles
  const updateActiveDesktop = (desktopUuid: string | null) => {
    console.log('Updating active desktop to:', desktopUuid);
    setActiveDesktop(desktopUuid);
    
    // Always fetch profiles after desktop change
    fetchProfiles();
  };
  
  // Fetch profiles on initial load or port change
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
    activeDesktop,
    updateActiveDesktop
  };
}
