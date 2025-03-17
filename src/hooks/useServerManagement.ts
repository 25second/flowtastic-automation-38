
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Server } from '@/types/server';
import { baseServerUrl } from '@/utils/constants';
import { useCallback } from 'react';

// Helper for fetch with timeout and error handling
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Constants
const SERVER_QUERY_KEY = 'servers';
const SERVER_TIMEOUT = 10000; // 10 seconds
const FETCH_RETRY_COUNT = 3;
const FETCH_RETRY_DELAY = 1000;
const STALE_TIME = 60000; // 1 minute

export const useServerManagement = () => {
  const queryClient = useQueryClient();

  // Fetch servers with robust error handling
  const { 
    data: servers, 
    isLoading, 
    error: serversError,
    refetch 
  } = useQuery({
    queryKey: [SERVER_QUERY_KEY],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading servers:', error);
          toast.error('Failed to load servers');
          throw error;
        }

        // Validate data is an array before returning
        if (!data || !Array.isArray(data)) {
          console.error('Invalid server data format:', data);
          return [];
        }

        return data as Server[];
      } catch (err) {
        console.error('Error loading servers:', err);
        return [];
      }
    },
    retry: FETCH_RETRY_COUNT,
    retryDelay: FETCH_RETRY_DELAY,
    staleTime: STALE_TIME,
  });

  // Check server status with improved error handling
  const checkServerStatus = useCallback(async (server: Server) => {
    if (!server || !server.id || !server.url) {
      console.error('Invalid server data:', server);
      return false;
    }
    
    try {
      // Use our fetchWithTimeout helper
      const response = await fetchWithTimeout(
        `${server.url}/health`, 
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
        SERVER_TIMEOUT
      );
      
      const isActive = response.ok;
      const now = new Date().toISOString();
      
      try {
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
        
        // Only invalidate queries if status changed
        queryClient.invalidateQueries({ queryKey: [SERVER_QUERY_KEY] });
      } catch (dbError) {
        console.error('Database error updating server status:', dbError);
      }
      
      return isActive;
    } catch (error) {
      console.error('Server status check failed:', error);
      const now = new Date().toISOString();
      
      try {
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
      } catch (dbError) {
        console.error('Database error marking server as inactive:', dbError);
      }
      
      queryClient.invalidateQueries({ queryKey: [SERVER_QUERY_KEY] });
      return false;
    }
  }, [queryClient]);

  // Register server with improved error handling
  const registerServer = useMutation({
    mutationFn: async ({ serverToken, serverName }: { serverToken: string; serverName: string }) => {
      if (!serverToken || !serverName) {
        throw new Error('Server token and name are required');
      }
      
      try {
        const response = await fetchWithTimeout(
          `${baseServerUrl}/workflow/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: serverToken }),
          },
          20000 // 20 second timeout for registration
        );

        if (!response.ok) {
          let errorText;
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = 'Unknown error';
          }
          throw new Error(`Failed to register server: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        let jsonResponse;
        try {
          jsonResponse = await response.json();
        } catch (e) {
          throw new Error(`Invalid server response: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        const { serverId } = jsonResponse;
        
        if (!serverId) {
          throw new Error('Server ID not returned from registration');
        }
        
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
      queryClient.invalidateQueries({ queryKey: [SERVER_QUERY_KEY] });
    },
  });

  // Delete server with improved error handling
  const deleteServer = useMutation({
    mutationFn: async (serverId: string) => {
      if (!serverId) {
        throw new Error('Server ID is required');
      }
      
      try {
        const { error } = await supabase
          .from('servers')
          .delete()
          .eq('id', serverId);

        if (error) {
          console.error('Failed to delete server:', error);
          toast.error('Failed to delete server');
          throw error;
        }
      } catch (err) {
        console.error('Error deleting server:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVER_QUERY_KEY] });
      toast.success('Server deleted successfully');
    },
  });

  return {
    servers: servers || [],
    isLoading,
    error: serversError,
    refetch,
    checkServerStatus,
    registerServer,
    deleteServer
  };
};
