
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkflowCategories = () => {
  useEffect(() => {
    const addCategoryColumn = async () => {
      try {
        const { data: columnExists } = await supabase
          .rpc('column_exists', { 
            p_table_name: 'workflows',
            p_column_name: 'category'
          });

        if (!columnExists) {
          const { error } = await supabase
            .rpc('add_column_if_not_exists', {
              p_table_name: 'workflows',
              p_column_name: 'category',
              p_column_type: 'text'
            });

          if (error) {
            console.error('Error adding category column:', error);
            toast.error('Failed to add category column');
          }
        }
      } catch (error) {
        console.error('Error checking/adding category column:', error);
      }
    };

    addCategoryColumn();
  }, []);
};
