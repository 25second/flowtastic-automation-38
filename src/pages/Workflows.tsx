
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useAccentColor } from '@/hooks/useAccentColor';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Category } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Workflows() {
  // Apply accent color
  useAccentColor();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['workflow-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    }
  });

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

  const handleCreateWorkflow = () => {
    navigate('/canvas');
  };

  const filteredWorkflows = selectedCategory
    ? workflows.filter(workflow => workflow.category === selectedCategory)
    : workflows;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8 overflow-y-auto">
          <DashboardHeader />
          
          <div className="flex justify-between items-center mt-8 mb-4">
            <h1 className="text-2xl font-bold">Рабочие процессы</h1>
            <Button onClick={handleCreateWorkflow} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Создать новый
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <WorkflowList 
              workflows={filteredWorkflows} 
              isLoading={isLoading} 
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
