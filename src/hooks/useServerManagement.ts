
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Server } from '@/types/server';
import { baseServerUrl } from '@/utils/constants';

export const useServerManagement = () => {
  const queryClient = useQueryClient();

  const { data: servers, isLoading } = useQuery({
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
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${server.url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const isActive = response.ok;
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('servers')
        .update({
          is_active: isActive,
          last_status_check: now,
          last_status_check_success: isActive
        })
        .eq('id', server.id);

      if (error) {
        console.error('Failed to update server status:', error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      
      return isActive;
    } catch (error) {
      console.error('Server status check failed:', error);
      const now = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('servers')
        .update({
          is_active: false,
          last_status_check: now,
          last_status_check_success: false
        })
        .eq('id', server.id);

      if (updateError) {
        console.error('Failed to update server status:', updateError);
      }
      
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      return false;
    }
  };

  const registerServer = useMutation({
    mutationFn: async ({ serverToken, serverName }: { serverToken: string; serverName: string }) => {
      try {
        // Use the constant for server URL and add error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${baseServerUrl}/workflow/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: serverToken }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Failed to register server: ${response.statusText}`);
        
        const { serverId } = await response.json();
        
        const { error } = await supabase
          .from('servers')
          .insert({
            id: serverId,
            name: serverName,
            url: baseServerUrl,
            is_active: true,
            last_status_check: new Date().toISOString(),
            last_status_check_success: true
          });

        if (error) throw error;
        
        toast.success('Server registered successfully');
        return serverId;
      } catch (error) {
        console.error('Server registration error:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to register server. Make sure the server is running.';
        toast.error(errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });

  const deleteServer = useMutation({
    mutationFn: async (serverId: string) => {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);

      if (error) {
        toast.error('Failed to delete server');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server deleted successfully');
    },
  });

  return {
    servers,
    isLoading,
    checkServerStatus,
    registerServer,
    deleteServer
  };
};
