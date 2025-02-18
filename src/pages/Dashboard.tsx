
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function Dashboard() {
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8 animate-fade-in">
          <div className="relative bg-white rounded-lg shadow-lg p-6 mb-8 transition-transform duration-300 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1EAEDB]/10 to-transparent rounded-lg pointer-events-none" />
            <DashboardHeader />
          </div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-blue-100/50 animate-fade-in [animation-delay:200ms]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#33C3F0]/5 to-transparent rounded-lg pointer-events-none" />
            <DashboardContent
              workflows={workflows}
              isLoading={isLoading}
              workflowName={workflowName}
              setWorkflowName={setWorkflowName}
              workflowDescription={workflowDescription}
              setWorkflowDescription={setWorkflowDescription}
              tags={tags}
              setTags={setTags}
              saveWorkflow={saveWorkflow}
              deleteWorkflow={deleteWorkflow}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
