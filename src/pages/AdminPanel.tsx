
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { RecentUsersTable } from '@/components/admin/dashboard/RecentUsersTable';
import { PlaceholderCards } from '@/components/admin/dashboard/PlaceholderCards';
import { formatDate } from '@/utils/formatters';
import { getOnlineUsersCount } from '@/utils/userStatus';
import { DateRangeFilter } from '@/hooks/useAdminStats';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { AdminDashboardLoading } from '@/components/admin/dashboard/AdminDashboardLoading';
import { AdminDashboardError } from '@/components/admin/dashboard/AdminDashboardError';
import { AdminDashboardHeader } from '@/components/admin/dashboard/AdminDashboardHeader';
import { ChartSection } from '@/components/admin/dashboard/ChartSection';

export default function AdminPanel() {
  console.log("Rendering AdminPanel component");
  
  // Use our custom hook to load all admin dashboard data
  const { stats, role, isLoading, hasError } = useAdminDashboard();
  
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
  } = stats;
  
  // Safely calculate online users count
  const onlineUsersCount = Array.isArray(recentUsers) && recentUsers.length 
    ? getOnlineUsersCount(recentUsers) 
    : 0;

  // Show error state if there's a problem
  if (hasError) {
    return <AdminDashboardError />;
  }

  // Show a meaningful loading state while data is being fetched
  if (isLoading || role.loading) {
    return <AdminDashboardLoading />;
  }

  // Safe handlers that check if the callback exists
  const handleDateRangeChange = (range: DateRangeFilter) => {
    if (typeof setDateRange === 'function') {
      setDateRange(range);
    } else {
      console.warn("setDateRange function is undefined");
    }
  };
  
  const handleActiveDateChange = (range: DateRangeFilter) => {
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
            <AdminDashboardHeader role={role.role} />
            
            {/* Stats Cards */}
            <StatsCards 
              userCount={userCount}
              onlineUsersCount={onlineUsersCount}
              loading={statsLoading}
              onRefresh={handleRefresh}
            />
            
            {/* Combined Charts */}
            <ChartSection
              userGrowthData={userGrowthData}
              dailyActiveData={dailyActiveData}
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
