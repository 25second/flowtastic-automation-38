
import { useState } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import { generateScript } from '@/utils/scriptGenerator';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useLinkenSphere } from './linkenSphere';
import { supabase } from '@/integrations/supabase/client';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';

// Define a runtime type check for the node structure
const hasValidNodeStructure = (node: unknown): node is FlowNodeWithData => {
  const n = node as any;
  return (
    n &&
    typeof n.id === 'string' &&
    typeof n.position === 'object' &&
    typeof n.position.x === 'number' &&
    typeof n.position.y === 'number' &&
    typeof n.data === 'object' &&
    typeof n.data.label === 'string'
  );
};

// Define a runtime type check for the edge structure
const hasValidEdgeStructure = (edge: unknown): edge is Edge => {
  const e = edge as any;
  return (
    e &&
    typeof e.id === 'string' &&
    typeof e.source === 'string' &&
    typeof e.target === 'string'
  );
};

const generateDebugPort = () => {
  // Generate a random port between 10000 and 65535
  return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
};

const saveSessionPort = (sessionId: string, port: number) => {
  localStorage.setItem(`session_${sessionId}_port`, port.toString());
};

const getStoredSessionPort = (sessionId: string): number | null => {
  const storedPort = localStorage.getItem(`session_${sessionId}_port`);
  return storedPort ? parseInt(storedPort, 10) : null;
};

export const useTaskExecution = () => {
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());
  const { startSession, stopSession } = useLinkenSphere();
  const { startWorkflow } = useWorkflowExecution(null, '');

  const checkSessionStatus = async (sessionId: string, port: string) => {
    try {
      const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions status');
      }
      const sessions = await response.json();
      return sessions.find((s: any) => s.uuid === sessionId)?.status || 'stopped';
    } catch (error) {
      console.error('Error checking session status:', error);
      return 'unknown';
    }
  };

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

      // 1. Start LinkenSphere sessions if they're not running
      for (const session of task.browser_sessions) {
        console.log('Processing session:', session);
        
        if (!session.id) {
          console.error('Invalid session: missing ID', session);
          continue;
        }

        if (session.type === 'session') {
          // Check current session status
          const currentStatus = await checkSessionStatus(session.id, port);
          console.log(`Current status for session ${session.id}:`, currentStatus);

          if (currentStatus === 'running' || currentStatus === 'automationRunning') {
            console.log('Session already running:', session.id);
            const storedPort = getStoredSessionPort(session.id);
            if (storedPort) {
              session.port = storedPort;
              console.log('Retrieved stored port:', storedPort);
            }
            continue;
          }

          // If session is stopped or in unknown state, try to start it
          if (currentStatus === 'stopped' || currentStatus === 'unknown') {
            console.log('Starting session:', session.id);
            const debugPort = generateDebugPort();
            
            try {
              // Wait a short time before starting session to avoid race conditions
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              const response = await fetch(`http://localhost:3001/linken-sphere/sessions/start?port=${port}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uuid: session.id,
                  headless: false,
                  debug_port: debugPort
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to start session ${session.id}:`, errorText);
                throw new Error(`Failed to start session: ${errorText}`);
              }

              const data = await response.json();
              console.log('Session start response:', data);
              
              // Wait for session to fully start
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Verify session started successfully
              const newStatus = await checkSessionStatus(session.id, port);
              if (newStatus !== 'running' && newStatus !== 'automationRunning') {
                throw new Error(`Session failed to start properly. Status: ${newStatus}`);
              }
              
              saveSessionPort(session.id, debugPort);
              session.port = debugPort;
              console.log(`Session ${session.id} started successfully with port ${debugPort}`);
            } catch (error) {
              console.error('Error starting session:', error);
              throw new Error(`Failed to start session ${session.id}: ${error.message}`);
            }
          }
        } else {
          console.log('Skipping non-session type:', session.type);
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
        console.log('Processing server:', server);
        
        for (const session of task.browser_sessions) {
          console.log('Checking session for execution:', session);
          
          if (!session.port) {
            console.error('No debug port for session:', session);
            continue;
          }

          console.log(`Executing workflow on server ${server} for session ${session.id} on port ${session.port}`);
          
          // Parse and validate workflow nodes and edges
          const rawNodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
          const rawEdges = Array.isArray(workflow.edges) ? workflow.edges : [];
          
          // Convert and validate nodes
          const nodes: FlowNodeWithData[] = [];
          for (const rawNode of rawNodes) {
            if (hasValidNodeStructure(rawNode)) {
              nodes.push(rawNode);
            } else {
              console.warn('Invalid node structure:', rawNode);
            }
          }
          
          // Convert and validate edges
          const edges: Edge[] = [];
          for (const rawEdge of rawEdges) {
            if (hasValidEdgeStructure(rawEdge)) {
              edges.push(rawEdge);
            } else {
              console.warn('Invalid edge structure:', rawEdge);
            }
          }

          console.log('Starting workflow with:', {
            nodes: nodes.length,
            edges: edges.length,
            browserPort: session.port,
            sessionId: session.id
          });
          
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
          // Remove stored port when stopping session
          localStorage.removeItem(`session_${session.id}_port`);
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
