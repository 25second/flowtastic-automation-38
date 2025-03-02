
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserStatsData {
  userCount: number;
  activeSessionsCount: number;
  recentUsers: any[];
  loading: boolean;
  userGrowthData: UserGrowthDataPoint[];
  dailyActiveData: DailyActiveDataPoint[];
}

export interface UserGrowthDataPoint {
  name: string;
  users: number;
  date: string;
}

export interface DailyActiveDataPoint {
  name: string;
  activeUsers: number;
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
  activeDateRange: DateRangeFilter;
  setActiveDateRange: (range: DateRangeFilter) => void;
  fetchDailyActiveData: () => Promise<void>;
} {
  const [userCount, setUserCount] = useState<number>(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);
  const [dailyActiveData, setDailyActiveData] = useState<DailyActiveDataPoint[]>([]);
  
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  });
  
  const [activeDateRange, setActiveDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
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

  const fetchDailyActiveData = async () => {
    try {
      if (!activeDateRange.startDate || !activeDateRange.endDate) return;
      
      const startDateStr = activeDateRange.startDate.toISOString();
      const endDateStr = activeDateRange.endDate.toISOString();
      
      // Fetch active sessions data grouped by day
      const { data, error } = await supabase
        .from('active_sessions')
        .select('last_active')
        .gte('last_active', startDateStr)
        .lte('last_active', endDateStr)
        .order('last_active');
        
      if (error) throw error;
      
      // Group the data by day
      const dailyData = new Map<string, number>();
      
      data?.forEach(session => {
        const date = new Date(session.last_active);
        const dayFormat = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const displayFormat = new Date(dayFormat).toLocaleDateString('default', { 
          month: 'short', 
          day: 'numeric'
        });
        
        if (dailyData.has(displayFormat)) {
          dailyData.set(displayFormat, dailyData.get(displayFormat)! + 1);
        } else {
          dailyData.set(displayFormat, 1);
        }
      });
      
      // Convert to array format for the chart
      const chartData: DailyActiveDataPoint[] = Array.from(dailyData.entries()).map(([name, activeUsers]) => ({
        name,
        activeUsers,
        date: name
      }));

      // Sort by date
      chartData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
      
      setDailyActiveData(chartData);
    } catch (error: any) {
      console.error('Error fetching daily active users data:', error);
      toast.error('Failed to load daily active users statistics');
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
    fetchDailyActiveData();
  }, []);

  useEffect(() => {
    fetchUserGrowthData();
  }, [dateRange]);

  useEffect(() => {
    fetchDailyActiveData();
  }, [activeDateRange]);

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
    fetchDailyActiveData
  };
}
