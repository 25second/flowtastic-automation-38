
import { isElectronApp, executePythonScript } from '@/electron';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all tables of the current user using a Python script
 * @returns Promise with the list of tables
 */
export async function getUserTablesWithPython(): Promise<any> {
  if (!isElectronApp) {
    toast.error('Python scripts can only run in desktop app');
    throw new Error('Python execution is only available in Electron application');
  }

  try {
    // Get the Supabase URL and anon key
    const supabaseUrl = "https://tlpwadvahkodwabcftjm.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscHdhZHZhaGtvZHdhYmNmdGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMTE5MTQsImV4cCI6MjA1NDY4NzkxNH0.UhPT7Kb0X8Sy1PqKcfrgkjIoqPLIDFuqzPxrNzqi1-E";
    
    // Get current session for JWT
    const { data: sessionData } = await supabase.auth.getSession();
    const jwt = sessionData?.session?.access_token || '';

    // Execute the Python script
    const result = await executePythonScript('get_user_tables.py', [
      '--url', supabaseUrl,
      '--key', supabaseKey,
      '--jwt', jwt
    ]);
    
    // Parse the result
    try {
      const parsed = JSON.parse(result);
      
      if (parsed.status === 'error') {
        toast.error('Failed to get tables with Python: ' + parsed.error);
        throw new Error(parsed.error);
      }
      
      return parsed.tables;
    } catch (parseError) {
      console.error('Failed to parse Python script result:', parseError);
      toast.error('Failed to parse Python script result');
      throw parseError;
    }
  } catch (error) {
    console.error('Error executing Python table script:', error);
    toast.error('Error executing Python script: ' + (error.message || String(error)));
    throw error;
  }
}
