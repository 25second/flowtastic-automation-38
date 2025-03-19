
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAnalyticsContext } from '@/components/analytics/AnalyticsProvider';
import { TaskListWidget } from '@/components/dashboard/TaskListWidget';
import { FavoritedWorkflows } from '@/components/dashboard/FavoritedWorkflows';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Dashboard() {
  useAccentColor();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { session, loading: authLoading } = useAuth();
  const { trackEvent } = useAnalyticsContext();
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

  useEffect(() => {
    console.log("Dashboard mounting");
    
    try {
      // Track dashboard page load
      trackEvent({
        event_type: 'page_view',
        event_data: { page: 'dashboard' }
      });
    } catch (err) {
      console.error("Failed to track page view:", err);
    }

    // Handle loading state timeout
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Forcing loading state to false after timeout");
        setIsLoading(false);
      }
    }, 5000);

    // Set loading to false when authentication and workflows are loaded
    if (!authLoading && !workflowsLoading) {
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, [workflowsLoading, isLoading, authLoading]);

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

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <p className="text-lg text-red-500">Произошла ошибка при загрузке панели управления</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
        </div>
      </div>
    );
  }

  try {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full overflow-hidden">
          <DashboardSidebar onNewWorkflow={() => {}} />
          <div className="flex-1 bg-background overflow-y-auto">
            <div className="container max-w-6xl mx-auto px-4 py-6">
              <DashboardHeader />
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                <TaskListWidget />
                
                <FavoritedWorkflows />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  } catch (e) {
    console.error("Error rendering Dashboard:", e);
    toast.error("Ошибка рендеринга. Пожалуйста, обновите страницу.");
    
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Панель управления</h1>
        <p className="text-red-500">Ошибка рендеринга. Пожалуйста, обновите страницу.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    );
  }
}
