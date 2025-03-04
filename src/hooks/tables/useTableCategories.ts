
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';

export const useTableCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      fetchCategories();
    }
  }, [session]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      if (!session?.user) {
        console.error('No user session found');
        setLoading(false);
        return;
      }
      
      // Use the workflow_categories table while table_categories is being added
      const { data, error } = await supabase
        .from('table_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching table categories:', error);
        toast.error('Failed to load table categories');
      } else {
        // Ensure the data conforms to the Category type
        const typedData: Category[] = data ? data.map(item => ({
          id: item.id,
          name: item.name,
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) : [];
        
        setCategories(typedData);
        
        // If categories is empty, create default category
        if (typedData.length === 0) {
          await createDefaultCategory();
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      setLoading(false);
    }
  };

  const createDefaultCategory = async () => {
    try {
      if (!session?.user) {
        console.error('No user session found for creating default category');
        return;
      }

      const { error } = await supabase
        .from('table_categories')
        .insert({
          name: 'General',
          user_id: session.user.id
        });

      if (error) {
        console.error('Error creating default table category:', error);
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
        .from('table_categories')
        .insert({
          name,
          user_id: session.user.id
        });

      if (error) {
        console.error('Error adding table category:', error);
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
        .from('table_categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Error deleting table category:', error);
        toast.error('Failed to delete category');
      } else {
        toast.success('Category deleted successfully');
        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
        }
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
        .from('table_categories')
        .update({ name: category.name })
        .eq('id', category.id);

      if (error) {
        console.error('Error updating table category:', error);
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
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchCategories,
    addCategory,
    deleteCategory,
    editCategory
  };
};
