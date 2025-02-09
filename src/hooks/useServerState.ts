
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Server {
  id: string;
  url: string;
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

  useEffect(() => {
    if (selectedServer) {
      const server = servers.find(s => s.id === selectedServer);
      if (server) {
        fetchBrowsers(server.url);
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
    servers,
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
  };
};
