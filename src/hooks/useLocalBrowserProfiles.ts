
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

  const fetchProfiles = async (desktopUuid?: string) => {
    if (!port) {
      toast.error('LinkenSphere port is not configured');
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the provided desktop UUID or fall back to the stored activeDesktop
      const desktopToUse = desktopUuid || activeDesktop;
      
      console.log(`Fetching profiles from port ${port}, desktop: ${desktopToUse || 'default'}`);
      
      // Make a request to our proxy server endpoint that will forward to LinkenSphere
      // Include desktop as a query parameter if we have one
      const params: Record<string, string> = { port };
      if (desktopToUse) {
        params.desktop = desktopToUse;
      }
      
      // Use axios with params object to properly encode query parameters
      const response = await axios.get<BrowserProfile[]>('/api/linkenSphere/sessions', { 
        params 
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
  
  // Update profiles when desktop changes
  const updateActiveDesktop = (desktopUuid: string | null) => {
    if (desktopUuid !== activeDesktop) {
      console.log('Updating active desktop to:', desktopUuid);
      setActiveDesktop(desktopUuid);
      
      // Only fetch if we have a desktop UUID
      if (desktopUuid) {
        fetchProfiles(desktopUuid);
      }
    }
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
