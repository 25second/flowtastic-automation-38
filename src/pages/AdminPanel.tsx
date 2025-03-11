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

export default function AdminPanel() {
  const { 
    userCount, 
    recentUsers, 
    loading, 
    userGrowthData, 
    dailyActiveData,
    dateRange, 
    setDateRange,
    activeDateRange,
    setActiveDateRange,
    refreshActiveSessionsCount
  } = useAdminStats();
  
  const { role } = useUserRole();
  
  const onlineUsersCount = recentUsers ? getOnlineUsersCount(recentUsers) : 0;

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
              loading={loading}
              onRefresh={refreshActiveSessionsCount}
            />
            
            {/* Combined Charts */}
            <CombinedCharts
              userGrowthData={userGrowthData}
              dailyActiveData={dailyActiveData}
              userGrowthDateRange={dateRange}
              activeDateRange={activeDateRange}
              onUserGrowthDateChange={setDateRange}
              onActiveDateChange={setActiveDateRange}
              loading={loading}
            />
            
            {/* Recent Registrations */}
            <RecentUsersTable 
              recentUsers={recentUsers} 
              loading={loading} 
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
