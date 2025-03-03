
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
import { ChatInput } from '@/components/dashboard/ChatInput';
import { toast } from 'sonner';
import { useState } from 'react';
import { BotIcon } from 'lucide-react';

export default function Dashboard() {
  // Apply accent color
  useAccentColor();
  const { role, loading: roleLoading } = useUserRole();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleChatSubmit = (message: string) => {
    setIsProcessing(true);
    
    // Simulate processing - in a real app this would call an API
    setTimeout(() => {
      toast.success(`Сообщение получено: ${message}`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8 overflow-y-auto">
          <DashboardHeader />
          
          {/* Chat Section - Full width container */}
          <div className="mt-8 mb-12 w-full border border-gray-200 rounded-2xl shadow-sm bg-white/50 p-4">
            {/* AI Welcome Message - 30% width */}
            <div className="mb-6 max-w-[30%] bg-accent/10 p-4 rounded-xl border border-accent/20 flex items-center gap-3">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full animate-pulse">
                <BotIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-lg font-medium">Чем займёмся сегодня, бро?</p>
            </div>
            
            {/* Full-width Chat Input */}
            <ChatInput 
              onSubmit={handleChatSubmit}
              isLoading={isProcessing}
              placeholder="Что вы хотите узнать о своих данных?"
            />
          </div>
          
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
