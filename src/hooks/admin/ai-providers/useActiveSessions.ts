
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useActiveSessions() {
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { refetch, isLoading } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: async () => {
      try {
        // Clear previous errors when attempting a new fetch
        setError(null);
        
        const { data, error, count } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact' })
          .gt('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
        if (error) {
          console.error('Error fetching active sessions:', error);
          setError(error.message);
          toast.error('Failed to load active sessions: ' + error.message);
          return [];
        }
        
        if (count !== null) {
          setActiveSessionsCount(count);
        }
        
        return data || [];
      } catch (err: any) {
        const errorMessage = err.message || 'Network error';
        console.error('Error in active sessions query:', err);
        setError(errorMessage);
        
        // Only show toast for actual errors, not when component unmounts
        if (errorMessage !== 'TypeError: Failed to fetch') {
          toast.error('Failed to load active sessions: ' + errorMessage);
        }
        
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // Don't show error UI for network issues
    meta: {
      errorMessage: 'Failed to load active sessions count'
    }
  });

  const refreshActiveSessionsCount = async () => {
    try {
      setError(null);
      await refetch();
      toast.success('Active sessions count refreshed');
    } catch (error: any) {
      console.error('Error refreshing active sessions count:', error);
      setError(error.message || 'Failed to refresh');
      toast.error('Failed to refresh active sessions count');
    }
  };

  return {
    activeSessionsCount,
    setActiveSessionsCount,
    refreshActiveSessionsCount,
    isLoading,
    error
  };
}
