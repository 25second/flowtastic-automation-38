
import { useQueryClient } from '@tanstack/react-query';
import { useCategoryManagement as useSharedCategoryManagement } from '../categories/useCategoryManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { Category } from '@/types/workflow';

export const useTableCategories = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  
  const categoryManagement = useSharedCategoryManagement('table_categories', session);
  
  // Enhance with React Query invalidation
  const handleCategoryDelete = async (categoryId: string) => {
    await categoryManagement.handleCategoryDelete(categoryId);
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };
  
  const handleCategoryEdit = async (updatedCategory: Category) => {
    await categoryManagement.handleCategoryEdit(updatedCategory);
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };
  
  const handleAddCategory = (name: string) => {
    categoryManagement.handleAddCategory(name);
    queryClient.invalidateQueries({ queryKey: ['tables'] });
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
