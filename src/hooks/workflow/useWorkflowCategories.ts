
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';

export const useWorkflowCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTableAndFetchCategories = async () => {
      try {
        setLoading(true);
        
        // Check if workflow_categories table exists
        const { data, error } = await supabase
          .from('workflow_categories')
          .select('id')
          .limit(1);

        if (error && error.code === '42P01') {  // Table doesn't exist error code
          // Create the table if it doesn't exist
          await createCategoriesTable();
        } else {
          // Fetch categories if the table exists
          await fetchCategories();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking workflow categories:', error);
        setLoading(false);
      }
    };

    checkTableAndFetchCategories();
  }, []);

  const createCategoriesTable = async () => {
    try {
      // Create the workflow_categories table
      const { error } = await supabase
        .from('workflow_categories')
        .insert([
          { 
            name: 'General', 
            description: 'Default category',
            color: '#3B82F6'
          }
        ]);

      if (error) {
        console.error('Error creating workflow_categories table:', error);
        toast.error('Failed to create categories table');
      } else {
        toast.success('Categories table created');
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error creating categories table:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      } else if (data) {
        setCategories(data as Category[]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return { categories, loading, fetchCategories };
};
