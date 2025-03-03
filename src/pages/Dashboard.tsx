
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useUserRole } from '@/hooks/useUserRole';
import { ChatInput } from '@/components/dashboard/ChatInput';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { BotIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TaskListWidget } from '@/components/dashboard/TaskListWidget';
import { FavoritedWorkflows } from '@/components/dashboard/FavoritedWorkflows';

export default function Dashboard() {
  // Apply accent color
  useAccentColor();
  const [isLoading, setIsLoading] = useState(true);
  const {
    role,
    loading: roleLoading
  } = useUserRole();
  const [isProcessing, setIsProcessing] = useState(false);
  const { session } = useAuth();
  const {
    workflows,
    isLoading: workflowsLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
    tags,
    setTags
  } = useWorkflowManager([] as Node[], [] as Edge[]);
  
  // Add effect to handle initial loading
  useEffect(() => {
    console.log("Dashboard mounting");
    if (!roleLoading && !workflowsLoading) {
      setIsLoading(false);
    }
  }, [roleLoading, workflowsLoading]);

  const handleChatSubmit = (message: string) => {
    setIsProcessing(true);

    // Simulate processing - in a real app this would call an API
    setTimeout(() => {
      toast.success(`Сообщение получено: ${message}`);
      setIsProcessing(false);
    }, 1500);
  };
  
  // Show loading indicator while the dashboard is initializing
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Загрузка панели управления...</p>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8 overflow-y-auto">
          <DashboardHeader />
          
          <div className="grid grid-cols-1 gap-6 mt-6">
            {/* Task List Widget */}
            <TaskListWidget />
            
            {/* Favorited Workflows */}
            <FavoritedWorkflows />
            
            {/* Chat Section */}
            <div className="w-full border border-gray-200 rounded-2xl shadow-sm bg-white/50 p-4">
              {/* AI Welcome Message */}
              <div className="mb-6 max-w-[30%] bg-accent/10 p-4 rounded-xl border border-accent/20 flex items-center gap-3">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full animate-pulse">
                  <BotIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-lg font-medium">Чем займёмся сегодня?</p>
              </div>
              
              {/* Chat Input */}
              <ChatInput 
                onSubmit={handleChatSubmit} 
                isLoading={isProcessing} 
                placeholder="Опиши подробно задачу, которую требуется выполнить" 
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
