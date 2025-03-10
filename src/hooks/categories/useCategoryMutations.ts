
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category, CategoryTableName } from './types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useCategoryMutations(
  tableName: CategoryTableName,
  fetchCategories: () => Promise<void>,
  setSelectedCategory: (categoryId: string | null) => void
) {
  const { session } = useAuth();

  const addCategory = useCallback(async (name: string) => {
    try {
      if (!session?.user) {
        toast.error('You must be logged in to add categories');
        return;
      }
      
      const { error } = await supabase
        .from(tableName)
        .insert({
          name,
          user_id: session.user.id
        });

      if (error) {
        console.error(`Error adding category to ${tableName}:`, error);
        toast.error('Failed to add category');
      } else {
        toast.success('Category added successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in addCategory:', error);
      toast.error('Failed to add category');
    }
  }, [session, tableName, fetchCategories]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error(`Error deleting category from ${tableName}:`, error);
        toast.error('Failed to delete category');
      } else {
        toast.success('Category deleted successfully');
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast.error('Failed to delete category');
    }
  }, [tableName, fetchCategories, setSelectedCategory]);

  const editCategory = useCallback(async (category: Category) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ name: category.name })
        .eq('id', category.id);

      if (error) {
        console.error(`Error updating category in ${tableName}:`, error);
        toast.error('Failed to update category');
      } else {
        toast.success('Category updated successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in editCategory:', error);
      toast.error('Failed to update category');
    }
  }, [tableName, fetchCategories]);

  return {
    addCategory,
    deleteCategory,
    editCategory
  };
}
