
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRangeFilter } from '@/types/dates';
import { UserGrowthDataPoint } from './types';

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
      
      const dailyData = new Map<string, number>();
      
      data?.forEach(profile => {
        const date = new Date(profile.created_at);
        const dayFormat = date.toISOString().split('T')[0];
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
      
      const chartData: UserGrowthDataPoint[] = Array.from(dailyData.entries()).map(([name, users]) => ({
        name,
        users,
        date: name
      }));
      
      chartData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
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
