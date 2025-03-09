import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';

export function useCategoryQueries(
  setCategories: (categories: Category[]) => void,
  setLoading: (loading: boolean) => void
) {
  const { session } = useAuth();

  // Define createDefaultCategory first
  const createDefaultCategory = useCallback(async () => {
    try {
      if (!session?.user) {
        console.error('No user session found for creating default category');
        return;
      }

      // First, check if a "General" category already exists
      const { data: existingCategories, error: checkError } = await supabase
        .from('agent_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('name', 'General');

      if (checkError) {
        console.error('Error checking for existing general category:', checkError);
        return;
      }

      // Only create if no "General" category exists
      if (existingCategories.length === 0) {
        const { error } = await supabase
          .from('agent_categories')
          .insert({
            name: 'General',
            user_id: session.user.id
          });

        if (error) {
          console.error('Error creating default agent category:', error);
        } else {
          // Call fetchCategories directly here since it's in the same scope
          fetchCategories();
        }
      }
    } catch (error) {
      console.error('Error in createDefaultCategory:', error);
    }
  }, [session]); // fetchCategories will be defined in this scope so no need to include it

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!session?.user) {
        console.error('No user session found');
        setLoading(false);
        return;
      }
      
      // Query to get distinct categories by name
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('agent_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error('Error fetching agent categories:', categoriesError);
        toast.error('Failed to load agent categories');
      } else {
        // Process the categories to ensure uniqueness by name
        const uniqueCategoriesMap = new Map();
        
        // Keep only the first occurrence of each category name
        categoriesData.forEach(category => {
          if (!uniqueCategoriesMap.has(category.name)) {
            uniqueCategoriesMap.set(category.name, {
              id: category.id,
              name: category.name,
              user_id: category.user_id,
              created_at: category.created_at,
              updated_at: category.updated_at
            });
          }
        });
        
        // Convert map values to array
        const formattedCategories: Category[] = Array.from(uniqueCategoriesMap.values());
        
        setCategories(formattedCategories);
        
        // If no categories found, create default
        if (formattedCategories.length === 0) {
          await createDefaultCategory();
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      setLoading(false);
    }
  }, [session, setCategories, setLoading, createDefaultCategory]);

  useEffect(() => {
    if (session?.user) {
      fetchCategories();
    }
  }, [session, fetchCategories]);

  return {
    fetchCategories,
    createDefaultCategory
  };
}
