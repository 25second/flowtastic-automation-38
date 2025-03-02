
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { UserGrowthChart } from '@/components/admin/dashboard/UserGrowthChart';
import { DailyActiveUsersChart } from '@/components/admin/dashboard/DailyActiveUsersChart';
import { RecentUsersTable } from '@/components/admin/dashboard/RecentUsersTable';
import { PlaceholderCards } from '@/components/admin/dashboard/PlaceholderCards';
import { useAdminStats } from '@/hooks/useAdminStats';
import { formatDate } from '@/utils/formatters';

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
    setActiveDateRange
  } = useAdminStats();

  return (
    <div className="w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 p-8 overflow-auto w-full">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            {/* Stats Cards */}
            <StatsCards 
              userCount={userCount} 
              activeSessionsCount={activeSessionsCount} 
              loading={loading} 
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
