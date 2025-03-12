
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useActiveSessions() {
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  
  const { refetch } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact' })
          .gt('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
        if (error) {
          console.error('Error fetching active sessions:', error);
          toast.error('Failed to load active sessions');
          return [];
        }
        
        if (count !== null) {
          setActiveSessionsCount(count);
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in active sessions query:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const refreshActiveSessionsCount = async () => {
    try {
      await refetch();
      toast.success('Active sessions count refreshed');
    } catch (error) {
      console.error('Error refreshing active sessions count:', error);
      toast.error('Failed to refresh active sessions count');
    }
  };

  return {
    activeSessionsCount,
    setActiveSessionsCount,
    refreshActiveSessionsCount
  };
}
