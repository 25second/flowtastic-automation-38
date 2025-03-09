
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';

export function useCategoryMutations(
  fetchCategories: () => Promise<void>,
  setSelectedCategory: (categoryId: string | null) => void
) {
  const { session } = useAuth();

  const createDefaultCategory = async () => {
    try {
      if (!session?.user) {
        console.error('No user session found for creating default category');
        return;
      }

      const { error } = await supabase
        .from('agent_categories')
        .insert({
          name: 'General',
          user_id: session.user.id
        });

      if (error) {
        console.error('Error creating default agent category:', error);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in createDefaultCategory:', error);
    }
  };

  const addCategory = async (name: string) => {
    try {
      if (!session?.user) {
        toast.error('You must be logged in to add categories');
        return;
      }
      
      const { error } = await supabase
        .from('agent_categories')
        .insert({
          name,
          user_id: session.user.id
        });

      if (error) {
        console.error('Error adding agent category:', error);
        toast.error('Failed to add category');
      } else {
        toast.success('Category added successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in addCategory:', error);
      toast.error('Failed to add category');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('agent_categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Error deleting agent category:', error);
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
  };

  const editCategory = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('agent_categories')
        .update({ name: category.name })
        .eq('id', category.id);

      if (error) {
        console.error('Error updating agent category:', error);
        toast.error('Failed to update category');
      } else {
        toast.success('Category updated successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error in editCategory:', error);
      toast.error('Failed to update category');
    }
  };

  return {
    createDefaultCategory,
    addCategory,
    deleteCategory,
    editCategory
  };
}
