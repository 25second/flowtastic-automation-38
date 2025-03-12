
import { useState, useEffect } from 'react';
import { useAdminStats, UserStatsData, DateRangeFilter } from '@/hooks/useAdminStats';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface AdminDashboardData {
  stats: Partial<UserStatsData & {
    dateRange: DateRangeFilter;
    setDateRange: (range: DateRangeFilter) => void;
    fetchUserGrowthData: () => Promise<void>;
    activeDateRange: DateRangeFilter;
    setActiveDateRange: (range: DateRangeFilter) => void;
    fetchDailyActiveData: () => Promise<void>;
    refreshActiveSessionsCount: () => Promise<void>;
  }>;
  role: {
    role?: UserRole | null;
    loading?: boolean;
  };
  isLoading: boolean;
  hasError: boolean;
}

export function useAdminDashboard(): AdminDashboardData {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Define proper typed variables with default values
  let adminStatsData: Partial<UserStatsData & {
    dateRange: DateRangeFilter;
    setDateRange: (range: DateRangeFilter) => void;
    fetchUserGrowthData: () => Promise<void>;
    activeDateRange: DateRangeFilter;
    setActiveDateRange: (range: DateRangeFilter) => void;
    fetchDailyActiveData: () => Promise<void>;
    refreshActiveSessionsCount: () => Promise<void>;
  }> = {};
  
  let userRoleData: { role?: UserRole | null; loading?: boolean } = {};
  
  try {
    // Store hook results in properly typed variables
    const adminStatsResult = useAdminStats();
    const userRoleResult = useUserRole();
    
    if (adminStatsResult) adminStatsData = adminStatsResult;
    if (userRoleResult) userRoleData = userRoleResult;
    
    console.log("Hooks loaded successfully");
  } catch (error) {
    console.error("Error using hooks:", error);
    setHasError(true);
    toast.error("Failed to load admin data");
  }
  
  // Initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch data on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Attempting to load initial data");
        if (typeof adminStatsData.fetchUserGrowthData === 'function') {
          await adminStatsData.fetchUserGrowthData();
          console.log("User growth data loaded");
        }
        if (typeof adminStatsData.fetchDailyActiveData === 'function') {
          await adminStatsData.fetchDailyActiveData();
          console.log("Daily active data loaded");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setHasError(true);
      }
    };
    
    loadInitialData();
  }, [adminStatsData.fetchUserGrowthData, adminStatsData.fetchDailyActiveData]);

  // Debug logging
  useEffect(() => {
    console.log("AdminDashboard state:", { 
      roleLoading: userRoleData.loading, 
      statsLoading: adminStatsData.loading, 
      role: userRoleData.role, 
      userCount: adminStatsData.userCount, 
      recentUsersLength: Array.isArray(adminStatsData.recentUsers) ? adminStatsData.recentUsers.length : 0,
      userGrowthDataLength: Array.isArray(adminStatsData.userGrowthData) ? adminStatsData.userGrowthData.length : 0,
      dailyActiveDataLength: Array.isArray(adminStatsData.dailyActiveData) ? adminStatsData.dailyActiveData.length : 0,
      dateRange: adminStatsData.dateRange ? JSON.stringify(adminStatsData.dateRange) : 'undefined',
      activeDateRange: adminStatsData.activeDateRange ? JSON.stringify(adminStatsData.activeDateRange) : 'undefined',
      hasRefreshFunction: !!adminStatsData.refreshActiveSessionsCount
    });
  }, [
    userRoleData.loading, 
    adminStatsData.loading, 
    userRoleData.role, 
    adminStatsData.userCount, 
    adminStatsData.recentUsers, 
    adminStatsData.userGrowthData, 
    adminStatsData.dailyActiveData, 
    adminStatsData.dateRange, 
    adminStatsData.activeDateRange, 
    adminStatsData.refreshActiveSessionsCount
  ]);

  return {
    stats: adminStatsData,
    role: userRoleData,
    isLoading,
    hasError
  };
}
