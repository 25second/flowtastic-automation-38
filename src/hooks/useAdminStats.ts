
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRangeFilter, UserStatsData } from './admin/types';
import { useUserGrowth } from './admin/useUserGrowth';
import { useDailyActiveUsers } from './admin/useDailyActiveUsers';
import { useAIProviders } from './admin/useAIProviders';

export type { UserStatsData, DateRangeFilter, UserGrowthDataPoint, DailyActiveDataPoint } from './admin/types';

export function useAdminStats(): UserStatsData & {
  dateRange: DateRangeFilter;
  setDateRange: (range: DateRangeFilter) => void;
  fetchUserGrowthData: () => Promise<void>;
  activeDateRange: DateRangeFilter;
  setActiveDateRange: (range: DateRangeFilter) => void;
  fetchDailyActiveData: () => Promise<void>;
  refreshActiveSessionsCount: () => Promise<void>;
} {
  const [userCount, setUserCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  });
  
  const [activeDateRange, setActiveDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  const { userGrowthData, fetchUserGrowthData } = useUserGrowth(dateRange);
  const { dailyActiveData, fetchDailyActiveData } = useDailyActiveUsers(activeDateRange);
  const { activeSessionsCount, refreshActiveSessionsCount, setActiveSessionsCount } = useAIProviders();
  
  useEffect(() => {
    async function fetchUserStats() {
      try {
        setLoading(true);
        
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Get all sessions active in the last 15 minutes
        const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000).toISOString();
        
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('last_active', fifteenMinutesAgo);
          
        if (sessionsError) throw sessionsError;
        
        const { data: recentData, error: recentError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (recentError) throw recentError;
        
        console.log(`Active sessions count: ${sessionsCount || 0}`);
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
    fetchUserGrowthData();
    fetchDailyActiveData();
    
    // Set up an interval to refresh the active sessions count every minute
    const intervalId = setInterval(() => {
      refreshActiveSessionsCount();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { 
    userCount, 
    activeSessionsCount, 
    recentUsers, 
    loading, 
    userGrowthData,
    dailyActiveData,
    dateRange,
    setDateRange,
    fetchUserGrowthData,
    activeDateRange,
    setActiveDateRange,
    fetchDailyActiveData,
    refreshActiveSessionsCount
  };
}
