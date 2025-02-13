
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useServerState = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [serverToken, setServerToken] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);
  const [browsers, setBrowsers] = useState<Array<{port: number, name: string, type: string}>>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<number | null>(null);

  const { data: servers = [] } = useQuery({
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

      return data;
    },
  });

  const registerServer = async () => {
    if (!serverToken) {
      toast.error('Server token is required');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/server/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Server registration failed: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setBrowsers(data.browsers);
      setShowServerDialog(false);
      toast.success('Server registered successfully');
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server');
    }
  };

  const startWorkflow = async (nodes: FlowNodeWithData[], edges: Edge[], browserPort: number) => {
    if (!selectedServer) {
      toast.error('No server selected');
      return;
    }

    if (!nodes.length) {
      toast.error('No nodes in workflow');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflow/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ nodes, edges, browserPort }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Workflow start failed: ${errorData.message || response.statusText}`);
        return;
      }

      toast.success('Workflow started successfully');
    } catch (error) {
      console.error('Workflow start error:', error);
      toast.error('Failed to start workflow');
    }
  };

  const startRecording = async (browserPort: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ browserPort }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Recording start failed: ${errorData.message || response.statusText}`);
        return;
      }

      toast.success('Recording started successfully');
    } catch (error) {
      console.error('Recording start error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async (): Promise<FlowNodeWithData[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Recording stop failed: ${errorData.message || response.statusText}`);
        return [];
      }

      const data = await response.json();
      toast.success('Recording stopped successfully');
      return data.nodes;
    } catch (error) {
      console.error('Recording stop error:', error);
      toast.error('Failed to stop recording');
      return [];
    }
  };

  return {
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
    startRecording,
    stopRecording,
    servers,
  };
};
