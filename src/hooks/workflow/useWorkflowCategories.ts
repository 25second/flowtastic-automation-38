
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';

export const useWorkflowCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Check if workflow_categories table has any entries
        const { data, error } = await supabase
          .from('workflow_categories')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Error checking workflow categories:', error);
          toast.error('Failed to check categories');
        } else if (data && data.length === 0) {
          // Create default category if table is empty
          await createDefaultCategory();
        }
        
        // Fetch all categories
        await fetchAllCategories();
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking workflow categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [session]);

  const createDefaultCategory = async () => {
    try {
      if (!session?.user?.id) {
        console.error('No user session found for creating default category');
        return;
      }

      // Insert a default category
      const { error } = await supabase
        .from('workflow_categories')
        .insert({
          name: 'General',
          user_id: session.user.id
          // Note: description and color aren't in the table schema
        });

      if (error) {
        console.error('Error creating default category:', error);
        toast.error('Failed to create default category');
      } else {
        toast.success('Default category created');
      }
    } catch (error) {
      console.error('Error creating default category:', error);
    }
  };

  const fetchAllCategories = async () => {
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

  return { categories, loading, fetchCategories: fetchAllCategories };
};
