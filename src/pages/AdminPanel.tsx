
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
import { useEffect } from 'react';

export default function AdminPanel() {
  console.log('AdminPanel component is rendering');
  
  try {
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
    
    // This is now the same logic used in the Users page
    const onlineUsersCount = recentUsers ? getOnlineUsersCount(recentUsers) : 0;

    // Log component rendering for debugging
    useEffect(() => {
      console.log('AdminPanel rendered', { role, loading, userCount });
      console.log('UserGrowthData:', userGrowthData);
      console.log('DailyActiveData:', dailyActiveData);
    }, [role, loading, userCount, userGrowthData, dailyActiveData]);

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
  } catch (error) {
    console.error('Error rendering AdminPanel:', error);
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col p-4">
        <h1 className="text-xl font-semibold text-red-500 mb-4">Ошибка загрузки админ-панели</h1>
        <div className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-w-full">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }
}
