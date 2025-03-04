
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { Session } from '@supabase/supabase-js';

export const useCategoryManagement = (session: Session | null) => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['workflow_categories', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      const { data, error } = await supabase
        .from('workflow_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        throw error;
      }

      return data as Category[];
    },
    enabled: !!session?.user,
  });

  const addCategory = useMutation({
    mutationFn: async (newCategory: { name: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
        throw error;
      }

      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflow_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const editCategory = useMutation({
    mutationFn: async (updatedCategory: Category) => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .update(updatedCategory)
        .eq('id', updatedCategory.id)
        .select()
        .single();
  
      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
        throw error;
      }
  
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleAddCategory = (name: string) => {
    if (!session?.user) {
      toast.error('You must be logged in to add categories');
      return;
    }
    
    addCategory.mutate({
      name,
      user_id: session.user.id
    });
  };

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCategoryEdit = async (updatedCategory: Category) => {
    try {
      await editCategory.mutateAsync(updatedCategory);
      toast.success('Category updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    categories,
    categoriesLoading,
    handleAddCategory,
    handleCategoryDelete,
    handleCategoryEdit
  };
};
