
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useActiveSessions() {
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);

  const refreshActiveSessionsCount = async () => {
    try {
      const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000).toISOString();
      
      const { count, error } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', fifteenMinutesAgo);
          
      if (error) throw error;
      
      console.log(`Refreshed active sessions count: ${count || 0}`);
      setActiveSessionsCount(count || 0);
      toast.success("Active sessions count refreshed");
    } catch (error: any) {
      console.error('Error refreshing active sessions count:', error);
      toast.error("Failed to refresh active sessions count");
    }
  };

  return { activeSessionsCount, refreshActiveSessionsCount, setActiveSessionsCount };
}
