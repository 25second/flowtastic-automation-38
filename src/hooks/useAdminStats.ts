
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserStatsData {
  userCount: number;
  activeSessionsCount: number;
  recentUsers: any[];
  loading: boolean;
}

export function useAdminStats(): UserStatsData {
  const [userCount, setUserCount] = useState<number>(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchUserStats() {
      try {
        setLoading(true);
        
        // Get user count
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Get active sessions count
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact', head: true });
          
        if (sessionsError) throw sessionsError;
        
        // Get recent registrations
        const { data: recentData, error: recentError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (recentError) throw recentError;
        
        setUserCount(count || 0);
        setActiveSessionsCount(sessionsCount || 0);
        setRecentUsers(recentData || []);
      } catch (error: any) {
        console.error('Error fetching user stats:', error);
        toast.error('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserStats();
  }, []);

  return { userCount, activeSessionsCount, recentUsers, loading };
}
