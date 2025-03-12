
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
import { useEffect } from "react";

export default function AdminPanel() {
  console.log("Rendering AdminPanel");
  
  // Use fallback values for every property to prevent undefined errors
  const { 
    userCount = 0, 
    recentUsers = [], 
    loading: statsLoading = true, 
    userGrowthData = [], 
    dailyActiveData = [],
    dateRange, 
    setDateRange,
    activeDateRange,
    setActiveDateRange,
    refreshActiveSessionsCount,
    // Add these fallback functions to prevent issues if hooks fail to provide them
    fetchUserGrowthData = async () => {},
    fetchDailyActiveData = async () => {}
  } = useAdminStats() || {};
  
  const { role = 'Loading...', loading: roleLoading = true } = useUserRole() || {};
  
  const onlineUsersCount = recentUsers?.length ? getOnlineUsersCount(recentUsers) : 0;

  // Add detailed logging to help troubleshoot the issue
  console.log("AdminPanel state:", { 
    roleLoading, 
    statsLoading, 
    role, 
    userCount, 
    recentUsersLength: recentUsers?.length,
    userGrowthDataLength: userGrowthData?.length,
    dailyActiveDataLength: dailyActiveData?.length,
    dateRange: dateRange ? JSON.stringify(dateRange) : 'undefined',
    activeDateRange: activeDateRange ? JSON.stringify(activeDateRange) : 'undefined',
    hasRefreshFunction: !!refreshActiveSessionsCount
  });
  
  // Fetch data on initial load if not already loaded
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (fetchUserGrowthData) await fetchUserGrowthData();
        if (fetchDailyActiveData) await fetchDailyActiveData();
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadInitialData();
  }, [fetchUserGrowthData, fetchDailyActiveData]);

  // Show a meaningful loading state while data is being fetched
  if (roleLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    );
  }

  // Default values for potentially undefined objects
  const safeUserGrowthDateRange = dateRange || {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  };
  
  const safeActiveDateRange = activeDateRange || {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  };
  
  // Safe handlers that check if the callback exists
  const handleDateRangeChange = (range) => {
    if (setDateRange) {
      setDateRange(range);
    } else {
      console.warn("setDateRange function is undefined");
    }
  };
  
  const handleActiveDateChange = (range) => {
    if (setActiveDateRange) {
      setActiveDateRange(range);
    } else {
      console.warn("setActiveDateRange function is undefined");
    }
  };
  
  const handleRefresh = async () => {
    try {
      if (refreshActiveSessionsCount) {
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
              userGrowthData={userGrowthData}
              dailyActiveData={dailyActiveData}
              userGrowthDateRange={safeUserGrowthDateRange}
              activeDateRange={safeActiveDateRange}
              onUserGrowthDateChange={handleDateRangeChange}
              onActiveDateChange={handleActiveDateChange}
              loading={statsLoading}
            />
            
            {/* Recent Registrations */}
            <RecentUsersTable 
              recentUsers={recentUsers} 
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
