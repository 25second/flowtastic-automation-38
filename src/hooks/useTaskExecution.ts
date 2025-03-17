
import { useState } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import { useWorkflowExecution } from '@/hooks/workflow-execution';
import { useLinkenSphere } from './linkenSphere';
import { supabase } from '@/integrations/supabase/client';
import { useSessionManagement, getStoredSessionPort, startBrowserSession, checkSessionStatus } from './task-execution/useSessionManagement';
import { validateWorkflowData } from './task-execution/workflowValidation';
import { useTaskStatus } from './task-execution/useTaskStatus';

export const useTaskExecution = () => {
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());
  const { startSession, stopSession } = useLinkenSphere();
  const { setActiveSession } = useSessionManagement();
  const { updateTaskStatus } = useTaskStatus();
  const { startWorkflow } = useWorkflowExecution(null, '');

  const startTask = async (task: Task) => {
    if (executingTasks.has(task.id)) {
      console.log('Task is already running:', task.id);
      return;
    }

    try {
      setExecutingTasks(prev => new Set(prev).add(task.id));
      console.log('Starting task execution with browser sessions:', task.browser_sessions);

      if (!task.browser_sessions || task.browser_sessions.length === 0) {
        throw new Error('No browser sessions configured for this task');
      }

      const port = localStorage.getItem('linkenSpherePort') || '40080';
      console.log('Using LinkenSphere port:', port);

      // Start browser sessions
      const sessionResults = [];
      for (const session of task.browser_sessions) {
        if (session.type === 'session') {
          try {
            console.group(`Starting session ${session.id}`);
            console.log('Starting session with config:', session);
            
            // First check if session exists and is running
            const status = await checkSessionStatus(session.id, port);
            console.log(`Session ${session.id} current status:`, status);

            // Attempt to start the session
            const result = await startBrowserSession(session, port);
            console.log('Session start result:', result);

            if (result) {
              const sessionPort = result.port;
              console.log(`Session ${session.id} assigned port:`, sessionPort);
              
              // Store the debug port in localStorage
              localStorage.setItem(`session_${session.id}_port`, String(sessionPort));
              
              sessionResults.push({ 
                id: session.id, 
                port: sessionPort,
                status: 'running'
              });
              
              console.log(`Session ${session.id} started successfully on port ${sessionPort}`);
            } else {
              throw new Error(`Failed to start session ${session.id}`);
            }
            console.groupEnd();
          } catch (error) {
            console.error('Error starting session:', error);
            throw new Error(`Failed to start session ${session.id}: ${error.message}`);
          }
        }
      }

      if (sessionResults.length === 0) {
        throw new Error('No sessions were successfully started');
      }

      // Fetch workflow data
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', task.workflow_id)
        .single();

      if (workflowError || !workflow) {
        throw new Error('Failed to fetch workflow: ' + workflowError?.message);
      }

      // Update task status to in_process
      await updateTaskStatus(task.id, 'in_process', true);

      // Execute workflow on each server
      for (const server of task.servers) {
        console.log('Processing server:', server);
        const { startWorkflow } = useWorkflowExecution(server, localStorage.getItem('serverToken') || '');
        
        for (const sessionResult of sessionResults) {
          console.group(`Executing workflow for session ${sessionResult.id}`);
          console.log('Session execution details:', sessionResult);

          const { nodes, edges } = validateWorkflowData(
            Array.isArray(workflow.nodes) ? workflow.nodes : [],
            Array.isArray(workflow.edges) ? workflow.edges : []
          );

          console.log('Starting workflow with:', {
            nodes: nodes.length,
            edges: edges.length,
            browserPort: sessionResult.port,
            sessionId: sessionResult.id
          });
          
          await startWorkflow(
            nodes,
            edges,
            {
              browserType: 'linkenSphere',
              browserPort: sessionResult.port,
              sessionId: sessionResult.id
            }
          );
          console.groupEnd();
        }
      }

      await updateTaskStatus(task.id, 'done');
      toast.success('Task completed successfully');

    } catch (error) {
      console.error('Task execution error:', error);
      await updateTaskStatus(task.id, 'error');
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
      for (const session of task.browser_sessions) {
        if (session.type === 'session') {
          console.log('Stopping session:', session.id);
          await stopSession(session.id);
          localStorage.removeItem(`session_${session.id}_port`);
        }
      }

      await updateTaskStatus(task.id, 'done');
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
