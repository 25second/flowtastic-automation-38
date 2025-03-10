
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { Session } from '@supabase/supabase-js';
import { useCategoryManagement as useSharedCategoryManagement } from '../categories/useCategoryManagement';

export const useCategoryManagement = (session: Session | null) => {
  const queryClient = useQueryClient();
  
  const categoryManagement = useSharedCategoryManagement('workflow_categories', session);
  
  // Add workflow-specific query fetching with React Query
  const { data, isLoading } = useQuery({
    queryKey: ['workflow_categories', session?.user?.id],
    queryFn: async () => {
      return categoryManagement.categories;
    },
    initialData: [],
    enabled: !!session?.user && categoryManagement.categories.length > 0,
  });
  
  // Enhance with React Query invalidation
  const handleCategoryDelete = async (categoryId: string) => {
    await categoryManagement.handleCategoryDelete(categoryId);
    queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
  };
  
  const handleCategoryEdit = async (updatedCategory: Category) => {
    await categoryManagement.handleCategoryEdit(updatedCategory);
    queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
  };
  
  const handleAddCategory = (name: string) => {
    categoryManagement.handleAddCategory(name);
    queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
  };

  return {
    categories: data || categoryManagement.categories,
    categoriesLoading: isLoading || categoryManagement.loading,
    selectedCategory: categoryManagement.selectedCategory,
    handleCategorySelect: categoryManagement.handleCategorySelect,
    handleAddCategory,
    handleCategoryDelete,
    handleCategoryEdit,
  };
};
