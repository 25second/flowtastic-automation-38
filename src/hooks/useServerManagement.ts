
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Server } from '@/types/server';

export const useServerManagement = () => {
  const [serverToken, setServerToken] = useState('');
  const [showServerDialog, setShowServerDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: servers } = useQuery({
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
      
      const newServer: Server = {
        id: serverId,
        url: 'http://localhost:3001',
        name: null,
        is_active: true,
        last_status_check: new Date().toISOString(),
        last_status_check_success: true
      };

      await supabase.from('servers').insert(newServer);
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      
      toast.success('Server registered successfully');
      setServerToken('');
      setShowServerDialog(false);
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server. Make sure the server is running on port 3001');
    }
  };

  return {
    servers: servers || [],
    serverToken,
    setServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    checkServerStatus,
  };
};
