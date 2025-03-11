
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRangeFilter, UserGrowthDataPoint } from './types';

export function useUserGrowth(dateRange: DateRangeFilter) {
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);

  const fetchUserGrowthData = async () => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) return;
      
      const startDateStr = dateRange.startDate.toISOString();
      const endDateStr = dateRange.endDate.toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
        .order('created_at');
        
      if (error) throw error;
      
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
      
      const chartData: UserGrowthDataPoint[] = Array.from(monthlyData.entries()).map(([name, users]) => ({
        name,
        users,
        date: name
      }));
      
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
    fetchUserGrowthData();
  }, [dateRange]);

  return { userGrowthData, fetchUserGrowthData };
}
