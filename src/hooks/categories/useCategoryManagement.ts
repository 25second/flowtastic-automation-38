
import { useCategoryState } from './useCategoryState';
import { useCategoryQueries } from './useCategoryQueries';
import { useCategoryMutations } from './useCategoryMutations';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Category, CategoryTableName } from './types';

export const useCategoryManagement = (tableName: CategoryTableName, session: Session | null) => {
  const {
    categories,
    setCategories,
    loading,
    setLoading,
    selectedCategory,
    setSelectedCategory
  } = useCategoryState();

  // First get the queries (includes createDefaultCategory)
  const {
    fetchCategories,
    createDefaultCategory
  } = useCategoryQueries(tableName, setCategories, setLoading);

  // Then pass functions to mutations
  const {
    addCategory,
    deleteCategory,
    editCategory
  } = useCategoryMutations(tableName, fetchCategories, setSelectedCategory);

  const handleAddCategory = (name: string) => {
    if (!session?.user) {
      toast.error('You must be logged in to add categories');
      return;
    }
    
    addCategory(name);
  };

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCategoryEdit = async (updatedCategory: Category) => {
    try {
      await editCategory(updatedCategory);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return {
    categories,
    loading: loading,
    selectedCategory,
    setSelectedCategory,
    handleCategorySelect,
    handleAddCategory,
    handleCategoryDelete,
    handleCategoryEdit,
    fetchCategories
  };
};
