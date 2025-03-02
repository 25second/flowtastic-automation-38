
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkflowCategories = () => {
  useEffect(() => {
    const addCategoryTable = async () => {
      try {
        // Check if workflow_categories table exists
        // Need to use .from('rpc') syntax for custom RPC calls
        const { data: tableExists, error: tableCheckError } = await supabase
          .from('rpc')
          .select('*')
          .eq('function_name', 'table_exists')
          .eq('p_table_name', 'workflow_categories')
          .single();

        if (tableCheckError) {
          console.error('Error checking workflow_categories table:', tableCheckError);
          return;
        }

        // Create workflow_categories table if it doesn't exist
        if (!tableExists || !tableExists.result) {
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
          
          // Execute SQL via RPC function
          const { error: createError } = await supabase
            .from('rpc')
            .select('*')
            .eq('function_name', 'execute_sql')
            .eq('sql', createTableQuery)
            .single();
          
          if (createError) {
            console.error('Error creating workflow_categories table:', createError);
          }
        }

        // Check if category column exists in workflows table
        const { data: columnExists, error: columnCheckError } = await supabase
          .from('rpc')
          .select('*')
          .eq('function_name', 'column_exists')
          .eq('p_table_name', 'workflows')
          .eq('p_column_name', 'category')
          .single();

        if (columnCheckError) {
          console.error('Error checking category column:', columnCheckError);
          return;
        }

        // Add category column to workflows table if it doesn't exist
        if (!columnExists || !columnExists.result) {
          const { error: addColumnError } = await supabase
            .from('rpc')
            .select('*')
            .eq('function_name', 'add_column_if_not_exists')
            .eq('p_table_name', 'workflows')
            .eq('p_column_name', 'category')
            .eq('p_column_type', 'UUID')
            .single();

          if (addColumnError) {
            console.error('Error adding category column:', addColumnError);
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
