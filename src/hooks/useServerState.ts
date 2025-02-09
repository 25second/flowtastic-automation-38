
import { useState } from 'react';
import { toast } from 'sonner';

interface Server {
  id: string;
  url: string;
}

export const useServerState = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);

  const registerServer = async () => {
    if (!newServerUrl) {
      toast.error('Please enter a server URL');
      return;
    }

    try {
      const response = await fetch(`${newServerUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to register server');
      
      const { serverId } = await response.json();
      setServers(prev => [...prev, { id: serverId, url: newServerUrl }]);
      toast.success('Server registered successfully');
      setNewServerUrl('');
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server');
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
    newServerUrl,
    setNewServerUrl,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
  };
};
