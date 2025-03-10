
import { useQueryClient } from '@tanstack/react-query';
import { useCategoryManagement as useSharedCategoryManagement } from '../categories/useCategoryManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { Category } from '@/types/workflow';

export const useAgentCategories = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  
  const categoryManagement = useSharedCategoryManagement('agent_categories', session);
  
  // Enhance with React Query invalidation
  const handleCategoryDelete = async (categoryId: string) => {
    await categoryManagement.handleCategoryDelete(categoryId);
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  };
  
  const handleCategoryEdit = async (updatedCategory: Category) => {
    await categoryManagement.handleCategoryEdit(updatedCategory);
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  };
  
  const handleAddCategory = (name: string) => {
    categoryManagement.handleAddCategory(name);
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  };

  return {
    categories: categoryManagement.categories,
    loading: categoryManagement.loading,
    selectedCategory: categoryManagement.selectedCategory,
    setSelectedCategory: categoryManagement.setSelectedCategory,
    fetchCategories: categoryManagement.fetchCategories,
    addCategory: handleAddCategory,
    deleteCategory: handleCategoryDelete,
    editCategory: handleCategoryEdit
  };
};
