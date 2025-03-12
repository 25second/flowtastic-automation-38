
import { useQueryClient } from '@tanstack/react-query';
import { useCategoryManagement } from '../categories/useCategoryManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { Category } from '../categories/types';

export const useAgentCategories = () => {
  console.log("Initializing useAgentCategories");
  const { session } = useAuth();
  const queryClient = useQueryClient();
  
  const categoryManagement = useCategoryManagement('agent_categories', session);
  
  // Enhance with React Query invalidation
  const handleCategoryDelete = async (categoryId: string) => {
    console.log("Deleting agent category:", categoryId);
    await categoryManagement.handleCategoryDelete(categoryId);
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  };
  
  const handleCategoryEdit = async (updatedCategory: Category) => {
    console.log("Editing agent category:", updatedCategory);
    await categoryManagement.handleCategoryEdit(updatedCategory);
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  };
  
  const handleAddCategory = (name: string) => {
    console.log("Adding agent category:", name);
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
