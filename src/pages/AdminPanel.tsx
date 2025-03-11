
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { UserGrowthChart } from '@/components/admin/dashboard/UserGrowthChart';
import { DailyActiveUsersChart } from '@/components/admin/dashboard/DailyActiveUsersChart';
import { RecentUsersTable } from '@/components/admin/dashboard/RecentUsersTable';
import { PlaceholderCards } from '@/components/admin/dashboard/PlaceholderCards';
import { useAdminStats } from '@/hooks/useAdminStats';
import { formatDate } from '@/utils/formatters';
import { useUserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/badge';

export default function AdminPanel() {
  const { 
    userCount, 
    activeSessionsCount, 
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
              activeSessionsCount={activeSessionsCount} 
              loading={loading}
              onRefresh={refreshActiveSessionsCount}
            />
            
            {/* User Growth Chart */}
            <UserGrowthChart 
              chartData={userGrowthData} 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange} 
              loading={loading} 
            />
            
            {/* Daily Active Users Chart */}
            <DailyActiveUsersChart 
              chartData={dailyActiveData} 
              dateRange={activeDateRange} 
              onDateRangeChange={setActiveDateRange} 
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
