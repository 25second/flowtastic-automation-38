
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserStatsData {
  userCount: number;
  activeSessionsCount: number;
  recentUsers: any[];
  loading: boolean;
  userGrowthData: UserGrowthDataPoint[];
}

export interface UserGrowthDataPoint {
  name: string;
  users: number;
  date: string;
}

export interface DateRangeFilter {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export function useAdminStats(): UserStatsData & {
  dateRange: DateRangeFilter;
  setDateRange: (range: DateRangeFilter) => void;
  fetchUserGrowthData: () => Promise<void>;
} {
  const [userCount, setUserCount] = useState<number>(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  });
  
  const fetchUserGrowthData = async () => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) return;
      
      const startDateStr = dateRange.startDate.toISOString();
      const endDateStr = dateRange.endDate.toISOString();
      
      // Fetch profiles created within the date range
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
        .order('created_at');
        
      if (error) throw error;
      
      // Group the data by month
      const monthlyData = new Map<string, number>();
      
      data?.forEach(profile => {
        const date = new Date(profile.created_at);
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, monthlyData.get(monthYear)! + 1);
        } else {
          monthlyData.set(monthYear, 1);
        }
      });
      
      // Convert to array format for the chart
      const chartData: UserGrowthDataPoint[] = Array.from(monthlyData.entries()).map(([name, users]) => ({
        name,
        users,
        date: name
      }));

      // Sort by date
      chartData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      setUserGrowthData(chartData);
    } catch (error: any) {
      console.error('Error fetching user growth data:', error);
      toast.error('Failed to load user growth statistics');
    }
  };
  
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
    fetchUserGrowthData();
  }, []);

  useEffect(() => {
    fetchUserGrowthData();
  }, [dateRange]);

  return { 
    userCount, 
    activeSessionsCount, 
    recentUsers, 
    loading, 
    userGrowthData,
    dateRange,
    setDateRange,
    fetchUserGrowthData
  };
}
