
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { UserGrowthChart } from '@/components/admin/dashboard/UserGrowthChart';
import { RecentUsersTable } from '@/components/admin/dashboard/RecentUsersTable';
import { PlaceholderCards } from '@/components/admin/dashboard/PlaceholderCards';
import { useAdminStats } from '@/hooks/useAdminStats';
import { formatDate } from '@/utils/formatters';

export default function AdminPanel() {
  const { userCount, activeSessionsCount, recentUsers, loading } = useAdminStats();
  
  // Sample data for the chart
  const chartData = [
    { name: 'Jan', users: 10 },
    { name: 'Feb', users: 15 },
    { name: 'Mar', users: 25 },
    { name: 'Apr', users: 30 },
    { name: 'May', users: 22 },
    { name: 'Jun', users: 40 },
  ];

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
            
            {/* Chart Section */}
            <UserGrowthChart chartData={chartData} />
            
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
