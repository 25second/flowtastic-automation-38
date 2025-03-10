
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';

export function useCategoryQueries(
  tableName: string,
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
        .from(tableName)
        .select('*')
        .eq('user_id', session.user.id)
        .eq('name', 'General');

      if (checkError) {
        console.error(`Error checking for existing general category in ${tableName}:`, checkError);
        return;
      }

      // Only create if no "General" category exists
      if (existingCategories.length === 0) {
        const { error } = await supabase
          .from(tableName)
          .insert({
            name: 'General',
            user_id: session.user.id
          });

        if (error) {
          console.error(`Error creating default category in ${tableName}:`, error);
        } else {
          // Call fetchCategories directly here since it's in the same scope
          fetchCategories();
        }
      }
    } catch (error) {
      console.error('Error in createDefaultCategory:', error);
    }
  }, [session, tableName]); // fetchCategories will be defined in this scope

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!session?.user) {
        console.error('No user session found');
        setLoading(false);
        return;
      }
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error(`Error fetching categories from ${tableName}:`, categoriesError);
        toast.error('Failed to load categories');
      } else {
        // Process the categories
        const formattedCategories: Category[] = categoriesData.map(item => ({
          id: item.id,
          name: item.name,
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
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
  }, [session, tableName, setCategories, setLoading, createDefaultCategory]);

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
