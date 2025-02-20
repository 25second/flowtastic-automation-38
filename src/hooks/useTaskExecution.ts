
import { useState } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import { generateScript } from '@/utils/scriptGenerator';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useLinkenSphere } from './linkenSphere';
import { supabase } from '@/integrations/supabase/client';

export const useTaskExecution = () => {
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());
  const { startSession, stopSession } = useLinkenSphere();
  const { startWorkflow } = useWorkflowExecution(null, ''); // We'll get these from the task

  const startTask = async (task: Task) => {
    if (executingTasks.has(task.id)) {
      console.log('Task is already running:', task.id);
      return;
    }

    try {
      setExecutingTasks(prev => new Set(prev).add(task.id));
      console.log('Starting task execution:', task);

      // 1. Start LinkenSphere sessions if they're not running
      for (const session of task.browser_sessions) {
        if (session.type === 'session' && (!session.status || session.status === 'stopped')) {
          console.log('Starting session:', session.id);
          await startSession(session.id);
        }
      }

      // 2. Get workflow details
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', task.workflow_id)
        .single();

      if (workflowError || !workflow) {
        throw new Error('Failed to fetch workflow: ' + workflowError?.message);
      }

      // 3. Update task status to in_process
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status: 'in_process',
          start_time: new Date().toISOString()
        })
        .eq('id', task.id);

      if (updateError) {
        throw new Error('Failed to update task status: ' + updateError.message);
      }

      // 4. Execute workflow on each session
      for (const server of task.servers) {
        for (const session of task.browser_sessions) {
          if (!session.port) {
            console.error('No debug port for session:', session);
            continue;
          }

          console.log(`Executing workflow on server ${server} for session ${session.id}`);
          
          // Parse workflow nodes and edges before passing them
          const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
          const edges = Array.isArray(workflow.edges) ? workflow.edges : [];
          
          await startWorkflow(
            nodes,
            edges,
            {
              browserType: 'linkenSphere',
              browserPort: session.port,
              sessionId: session.id
            }
          );
        }
      }

      // 5. Update task status to done
      await supabase
        .from('tasks')
        .update({ 
          status: 'done',
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      toast.success('Task completed successfully');

    } catch (error) {
      console.error('Task execution error:', error);
      
      // Update task status to error
      await supabase
        .from('tasks')
        .update({ 
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      toast.error('Task execution failed: ' + (error as Error).message);

    } finally {
      setExecutingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const stopTask = async (task: Task) => {
    try {
      // 1. Stop all sessions associated with the task
      for (const session of task.browser_sessions) {
        if (session.type === 'session') {
          console.log('Stopping session:', session.id);
          await stopSession(session.id);
        }
      }

      // 2. Update task status
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status: 'done',
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (updateError) {
        throw new Error('Failed to update task status: ' + updateError.message);
      }

      toast.success('Task stopped successfully');

    } catch (error) {
      console.error('Error stopping task:', error);
      toast.error('Failed to stop task: ' + (error as Error).message);
    }
  };

  return {
    startTask,
    stopTask,
    isExecuting: (taskId: string) => executingTasks.has(taskId)
  };
};
