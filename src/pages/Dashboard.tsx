
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useAccentColor } from '@/hooks/useAccentColor';
import { StatisticsCards } from '@/components/dashboard/stats/StatisticsCards';
import { TaskStatusChart } from '@/components/dashboard/stats/TaskStatusChart';
import { WorkflowUsageChart } from '@/components/dashboard/stats/WorkflowUsageChart';
import { RecentTasksActivity } from '@/components/dashboard/stats/RecentTasksActivity';
import { useUserRole } from '@/hooks/useUserRole';

export default function Dashboard() {
  // Apply accent color
  useAccentColor();
  const { role, loading: roleLoading } = useUserRole();

  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
    tags,
    setTags,
  } = useWorkflowManager([] as Node[], [] as Edge[]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8 overflow-y-auto">
          <DashboardHeader />
          
          {/* Dashboard Content */}
          <div className="mt-8 space-y-6">
            {/* Statistics Cards */}
            <StatisticsCards />
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TaskStatusChart />
              <WorkflowUsageChart />
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RecentTasksActivity />
              <div className="col-span-1 md:col-span-2">
                {/* This space can be used for additional components, 
                    like active sessions or system status */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
