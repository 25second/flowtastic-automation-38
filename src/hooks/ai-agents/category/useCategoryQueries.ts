
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
      
      // Instead of first getting agents and their categories,
      // directly fetch all categories belonging to the current user
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('agent_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error('Error fetching agent categories:', categoriesError);
        toast.error('Failed to load agent categories');
      } else {
        // Transform data to match Category type
        const formattedCategories: Category[] = categoriesData.map(item => ({
          id: item.id,
          name: item.name,
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        setCategories(formattedCategories);
        
        // If no categories found, create default
        if (categoriesData.length === 0) {
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
