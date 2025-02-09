
import { useState } from 'react';
import { toast } from 'sonner';

interface Server {
  id: string;
  url: string;
}

export const useServerState = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [serverToken, setServerToken] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);

  const registerServer = async () => {
    if (!serverToken) {
      toast.error('Please enter a server token');
      return;
    }

    try {
      // Connect directly to local server
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: serverToken })
      });

      if (!response.ok) throw new Error('Failed to register server');
      
      const { serverId } = await response.json();
      
      // Add the local server to the list
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

  const startWorkflow = async (nodes: any[], edges: any[]) => {
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
      toast.promise(
        fetch(`${server.url}/execute-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to execute workflow');
          const data = await res.json();
          console.log('Workflow execution response:', data);
        }),
        {
          loading: 'Executing workflow...',
          success: 'Workflow completed successfully!',
          error: 'Failed to execute workflow'
        }
      );
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error('Failed to execute workflow');
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
  };
};
