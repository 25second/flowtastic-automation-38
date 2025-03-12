
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { CombinedCharts } from '@/components/admin/dashboard/CombinedCharts';
import { RecentUsersTable } from '@/components/admin/dashboard/RecentUsersTable';
import { PlaceholderCards } from '@/components/admin/dashboard/PlaceholderCards';
import { useAdminStats } from '@/hooks/useAdminStats';
import { formatDate } from '@/utils/formatters';
import { useUserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/badge';
import { getOnlineUsersCount } from '@/utils/userStatus';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from 'sonner';

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log("Rendering AdminPanel component");
  
  // Use try-catch in a useEffect to catch and display any errors during render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Safely access hooks with error handling
  let adminStatsData = {};
  let userRoleData = {};
  
  try {
    adminStatsData = useAdminStats() || {};
    userRoleData = useUserRole() || {};
    console.log("Hooks loaded successfully");
  } catch (error) {
    console.error("Error using hooks:", error);
    setHasError(true);
    toast.error("Failed to load admin data");
  }
  
  // Destructure with default values for safety
  const { 
    userCount = 0, 
    recentUsers = [], 
    loading: statsLoading = true, 
    userGrowthData = [], 
    dailyActiveData = [],
    dateRange = {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date()
    }, 
    setDateRange = () => {},
    activeDateRange = {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date()
    },
    setActiveDateRange = () => {},
    refreshActiveSessionsCount = async () => {},
    fetchUserGrowthData = async () => {},
    fetchDailyActiveData = async () => {}
  } = adminStatsData;
  
  const { 
    role = 'Loading...', 
    loading: roleLoading = true 
  } = userRoleData;
  
  // Safely calculate online users count
  const onlineUsersCount = Array.isArray(recentUsers) && recentUsers.length 
    ? getOnlineUsersCount(recentUsers) 
    : 0;

  // Debug logging
  useEffect(() => {
    console.log("AdminPanel state:", { 
      roleLoading, 
      statsLoading, 
      role, 
      userCount, 
      recentUsersLength: Array.isArray(recentUsers) ? recentUsers.length : 0,
      userGrowthDataLength: Array.isArray(userGrowthData) ? userGrowthData.length : 0,
      dailyActiveDataLength: Array.isArray(dailyActiveData) ? dailyActiveData.length : 0,
      dateRange: dateRange ? JSON.stringify(dateRange) : 'undefined',
      activeDateRange: activeDateRange ? JSON.stringify(activeDateRange) : 'undefined',
      hasRefreshFunction: !!refreshActiveSessionsCount
    });
  }, [roleLoading, statsLoading, role, userCount, recentUsers, userGrowthData, dailyActiveData, dateRange, activeDateRange, refreshActiveSessionsCount]);
  
  // Fetch data on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Attempting to load initial data");
        if (typeof fetchUserGrowthData === 'function') {
          await fetchUserGrowthData();
          console.log("User growth data loaded");
        }
        if (typeof fetchDailyActiveData === 'function') {
          await fetchDailyActiveData();
          console.log("Daily active data loaded");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setHasError(true);
      }
    };
    
    loadInitialData();
  }, [fetchUserGrowthData, fetchDailyActiveData]);

  // Show error state if there's a problem
  if (hasError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We encountered an error loading the admin dashboard</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  // Show a meaningful loading state while data is being fetched
  if (isLoading || roleLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-[200px] mx-auto" />
          <Skeleton className="h-4 w-[300px] mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Safe handlers that check if the callback exists
  const handleDateRangeChange = (range) => {
    if (typeof setDateRange === 'function') {
      setDateRange(range);
    } else {
      console.warn("setDateRange function is undefined");
    }
  };
  
  const handleActiveDateChange = (range) => {
    if (typeof setActiveDateRange === 'function') {
      setActiveDateRange(range);
    } else {
      console.warn("setActiveDateRange function is undefined");
    }
  };
  
  const handleRefresh = async () => {
    try {
      if (typeof refreshActiveSessionsCount === 'function') {
        await refreshActiveSessionsCount();
      } else {
        console.warn("refreshActiveSessionsCount function is undefined");
      }
    } catch (error) {
      console.error("Error refreshing active sessions count:", error);
    }
  };

  return (
    <div className="w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 p-8 overflow-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Badge variant="outline" className="px-3 py-1">
                Role: {role || 'Loading...'}
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <StatsCards 
              userCount={userCount}
              onlineUsersCount={onlineUsersCount}
              loading={statsLoading}
              onRefresh={handleRefresh}
            />
            
            {/* Combined Charts */}
            <CombinedCharts
              userGrowthData={userGrowthData || []}
              dailyActiveData={dailyActiveData || []}
              userGrowthDateRange={dateRange}
              activeDateRange={activeDateRange}
              onUserGrowthDateChange={handleDateRangeChange}
              onActiveDateChange={handleActiveDateChange}
              loading={statsLoading}
            />
            
            {/* Recent Registrations */}
            <RecentUsersTable 
              recentUsers={recentUsers || []} 
              loading={statsLoading} 
              formatDate={formatDate} 
            />
            
            {/* Additional chart/list placeholders */}
            <PlaceholderCards />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
