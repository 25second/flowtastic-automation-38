
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export const useTaskStatus = () => {
  const updateTaskStatus = async (taskId: string, status: 'in_process' | 'done' | 'error', startTime?: boolean) => {
    const updates: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (startTime) {
      updates.start_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      throw new Error('Failed to update task status: ' + error.message);
    }
  };

  return { updateTaskStatus };
};
