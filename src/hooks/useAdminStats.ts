
import { useState } from 'react';
import { DateRangeFilter } from '@/types/dates';

// Define types we need
interface UserStatsData {
  userCount: number;
  recentUsers: any[];
  loading: boolean;
  userGrowthData: any[];
  dailyActiveData: any[];
}

export function useAdminStats(): UserStatsData & {
  dateRange: DateRangeFilter;
  setDateRange: (range: DateRangeFilter) => void;
  activeDateRange: DateRangeFilter;
  setActiveDateRange: (range: DateRangeFilter) => void;
  fetchUserGrowthData: () => Promise<void>;
  fetchDailyActiveData: () => Promise<void>;
  refreshActiveSessionsCount: () => Promise<void>;
} {
  const [userCount, setUserCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [dailyActiveData, setDailyActiveData] = useState<any[]>([]);
  
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  });
  
  const [activeDateRange, setActiveDateRange] = useState<DateRangeFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  // Placeholder functions to prevent errors
  const fetchUserGrowthData = async () => {
    console.log('fetchUserGrowthData called');
  };
  
  const fetchDailyActiveData = async () => {
    console.log('fetchDailyActiveData called');
  };
  
  const refreshActiveSessionsCount = async () => {
    console.log('refreshActiveSessionsCount called');
  };

  return { 
    userCount, 
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
