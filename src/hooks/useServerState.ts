
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Server {
  id: string;
  url: string;
  name: string | null;
  is_active: boolean;
  last_status_check: string | null;
  last_status_check_success: boolean;
}

interface Browser {
  port: number;
  name: string;
  type: string;
}

export const useServerState = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [serverToken, setServerToken] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);
  const [browsers, setBrowsers] = useState<Browser[]>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const queryClient = useQueryClient();

  const { data: liveServers } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load servers');
        throw error;
      }

      return data as Server[];
    },
  });

  useEffect(() => {
    if (liveServers) {
      setServers(liveServers);
    }
  }, [liveServers]);

  useEffect(() => {
    const checkServerStatus = async (server: Server) => {
      try {
        const response = await fetch(`${server.url}/health`);
        const isSuccessful = response.ok;
        
        await supabase
          .from('servers')
          .update({
            last_status_check: new Date().toISOString(),
            last_status_check_success: isSuccessful,
            is_active: isSuccessful
          })
          .eq('id', server.id);

        queryClient.invalidateQueries({ queryKey: ['servers'] });
      } catch (error) {
        await supabase
          .from('servers')
          .update({
            last_status_check: new Date().toISOString(),
            last_status_check_success: false,
            is_active: false
          })
          .eq('id', server.id);

        queryClient.invalidateQueries({ queryKey: ['servers'] });
      }
    };

    const interval = setInterval(() => {
      if (liveServers) {
        liveServers.forEach(checkServerStatus);
      }
    }, 30000); // Check every 30 seconds

    // Initial check
    if (liveServers) {
      liveServers.forEach(checkServerStatus);
    }

    return () => clearInterval(interval);
  }, [liveServers, queryClient]);

  useEffect(() => {
    if (selectedServer) {
      const server = servers.find(s => s.id === selectedServer);
      if (server && server.is_active) {
        fetchBrowsers(server.url);
      } else {
        setBrowsers([]);
        setSelectedBrowser(null);
      }
    }
  }, [selectedServer]);

  const fetchBrowsers = async (serverUrl: string) => {
    try {
      const response = await fetch(`${serverUrl}/browsers`);
      if (!response.ok) throw new Error('Failed to fetch browsers');
      const { browsers: availableBrowsers } = await response.json();
      setBrowsers(availableBrowsers);
      if (availableBrowsers.length > 0) {
        setSelectedBrowser(availableBrowsers[0].port);
      }
    } catch (error) {
      console.error('Error fetching browsers:', error);
      toast.error('Failed to fetch available browsers');
    }
  };

  const startRecording = async () => {
    if (!selectedServer || !selectedBrowser) {
      toast.error('Please select a server and browser first');
      return;
    }

    const server = servers.find(s => s.id === selectedServer);
    if (!server) {
      toast.error('Selected server not found');
      return;
    }

    try {
      const response = await fetch(`${server.url}/start-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browserPort: selectedBrowser })
      });

      if (!response.ok) throw new Error('Failed to start recording');
      
      setIsRecording(true);
      toast.success('Recording started! Perform actions in the browser and they will be recorded.');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!selectedServer) return;

    const server = servers.find(s => s.id === selectedServer);
    if (!server) return;

    try {
      const response = await fetch(`${server.url}/stop-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to stop recording');
      
      const { nodes } = await response.json();
      setIsRecording(false);
      return nodes;
    } catch (error) {
      console.error('Stop recording error:', error);
      toast.error('Failed to stop recording');
      setIsRecording(false);
    }
  };

  const registerServer = async () => {
    if (!serverToken) {
      toast.error('Please enter a server token');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: serverToken })
      });

      if (!response.ok) throw new Error('Failed to register server');
      
      const { serverId } = await response.json();
      
      setServers(prev => [...prev, { 
        id: serverId, 
        url: 'http://localhost:3001' 
      }]);
      
      toast.success('Server registered successfully');
      setServerToken('');
      setShowServerDialog(false);
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server. Make sure the server is running on port 3001');
    }
  };

  const startWorkflow = async (nodes: any[], edges: any[], browserPort: number) => {
    if (!selectedServer) {
      toast.error('Please select a server to execute the workflow');
      return;
    }

    const server = servers.find(s => s.id === selectedServer);
    if (!server) {
      toast.error('Selected server not found');
      return;
    }

    try {
      await toast.promise(
        fetch(`${server.url}/execute-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges, browserPort })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to execute workflow');
          const data = await res.json();
          console.log('Workflow execution response:', data);
        }),
        {
          loading: `Executing workflow in browser on port ${browserPort}...`,
          success: `Workflow completed successfully in browser on port ${browserPort}!`,
          error: `Failed to execute workflow in browser on port ${browserPort}`
        }
      );
    } catch (error) {
      console.error('Workflow execution error:', error);
    }
  };

  return {
    servers: liveServers || [],
    selectedServer,
    setSelectedServer,
    serverToken,
    setServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    isRecording,
    startRecording,
    stopRecording,
  };
};
