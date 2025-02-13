
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
      <div className="min-h-screen flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8">
          <DashboardHeader />
          <DashboardContent
            workflows={workflows || []}
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
    </SidebarProvider>
  );
}
