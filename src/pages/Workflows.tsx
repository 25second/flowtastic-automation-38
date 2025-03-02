
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Workflows() {
  // Apply accent color
  useAccentColor();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .insert([{ name: categoryName }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Категория добавлена');
      queryClient.invalidateQueries({ queryKey: ['workflow-categories'] });
    },
    onError: (error) => {
      toast.error(`Ошибка при добавлении категории: ${error.message}`);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('workflow_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Категория удалена');
      queryClient.invalidateQueries({ queryKey: ['workflow-categories'] });
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении категории: ${error.message}`);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from('workflow_categories')
        .update({ name: category.name })
        .eq('id', category.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Категория обновлена');
      queryClient.invalidateQueries({ queryKey: ['workflow-categories'] });
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении категории: ${error.message}`);
    }
  });

  const {
    workflows,
    isLoading,
    deleteWorkflow,
  } = useWorkflowManager([] as Node[], [] as Edge[]);

  const handleCreateWorkflow = () => {
    navigate('/canvas');
  };

  const handleEditWorkflow = (workflow: any) => {
    navigate(`/canvas/${workflow.id}`);
  };

  const handleRunWorkflow = (workflow: any) => {
    navigate(`/canvas/${workflow.id}?run=true`);
  };

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
              workflows={workflows} 
              isLoading={isLoading} 
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
              categories={categories}
              categoriesLoading={categoriesLoading}
              onAddCategory={(name) => addCategoryMutation.mutate(name)}
              onDeleteCategory={(id) => deleteCategoryMutation.mutate(id)}
              onEditCategory={(category) => updateCategoryMutation.mutate(category)}
              onDelete={(ids) => ids.forEach(id => deleteWorkflow.mutate(id))}
              onEditDetails={handleEditWorkflow}
              onRun={handleRunWorkflow}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
