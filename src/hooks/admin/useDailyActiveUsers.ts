
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRangeFilter, DailyActiveDataPoint } from './types';

export function useDailyActiveUsers(activeDateRange: DateRangeFilter) {
  const [dailyActiveData, setDailyActiveData] = useState<DailyActiveDataPoint[]>([]);

  const fetchDailyActiveData = async () => {
    try {
      if (!activeDateRange.startDate || !activeDateRange.endDate) return;
      
      const startDateStr = activeDateRange.startDate.toISOString();
      const endDateStr = activeDateRange.endDate.toISOString();
      
      const { data, error } = await supabase
        .from('active_sessions')
        .select('last_active')
        .gte('last_active', startDateStr)
        .lte('last_active', endDateStr)
        .order('last_active');
        
      if (error) throw error;
      
      const dailyData = new Map<string, number>();
      
      data?.forEach(session => {
        const date = new Date(session.last_active);
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
      
      const chartData: DailyActiveDataPoint[] = Array.from(dailyData.entries()).map(([name, activeUsers]) => ({
        name,
        activeUsers,
        date: name
      }));
      
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
    fetchDailyActiveData();
  }, [activeDateRange]);

  return { dailyActiveData, fetchDailyActiveData };
}
