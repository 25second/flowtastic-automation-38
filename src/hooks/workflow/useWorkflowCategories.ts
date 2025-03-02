
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkflowCategories = () => {
  useEffect(() => {
    const addCategoryTable = async () => {
      try {
        // Check if workflow_categories table exists
        const { data: tableExists, error: tableCheckError } = await supabase
          .rpc('column_exists', {
            p_table_name: 'workflows',
            p_column_name: 'category'
          });

        if (tableCheckError) {
          console.error('Error checking workflow_categories table:', tableCheckError);
          return;
        }

        // Create workflow_categories table if it doesn't exist
        if (!tableExists) {
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.workflow_categories (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              description TEXT,
              color TEXT,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            ALTER TABLE public.workflow_categories ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view their own categories" 
              ON public.workflow_categories 
              FOR SELECT 
              USING (auth.uid() = user_id);
              
            CREATE POLICY "Users can insert their own categories" 
              ON public.workflow_categories 
              FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
              
            CREATE POLICY "Users can update their own categories" 
              ON public.workflow_categories 
              FOR UPDATE 
              USING (auth.uid() = user_id);
              
            CREATE POLICY "Users can delete their own categories" 
              ON public.workflow_categories 
              FOR DELETE 
              USING (auth.uid() = user_id);
              
            CREATE TRIGGER handle_updated_at
              BEFORE UPDATE ON public.workflow_categories
              FOR EACH ROW
              EXECUTE FUNCTION update_updated_at_column();
          `;
          
          // Since we can't directly execute SQL via the Supabase client,
          // we'll need to add the column directly
          const { error: columnAddError } = await supabase
            .rpc('add_column_if_not_exists', {
              p_table_name: 'workflows',
              p_column_name: 'category',
              p_column_type: 'UUID'
            });
          
          if (columnAddError) {
            console.error('Error adding category column:', columnAddError);
            toast.error('Failed to add category column');
          }
        }
      } catch (error) {
        console.error('Error checking/adding workflow_categories table:', error);
      }
    };

    addCategoryTable();
  }, []);
};
