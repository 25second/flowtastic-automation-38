
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from './ai-agents/types';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';
import { startAgent } from '@/utils/agents/startAgent';

export function useAgentExecution() {
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());
  const [agentResults, setAgentResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeAgent = useCallback(async (agent: Agent, sessionId: string) => {
    if (executingAgents.has(agent.id)) {
      toast.info('This agent is already running');
      return;
    }

    setIsLoading(true);

    try {
      // Get debug port from stored session
      const browserPort = getStoredSessionPort(sessionId);
      
      if (!browserPort) {
        throw new Error('No browser port found for this session. Make sure the browser session is running.');
      }

      // Add to executing agents
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.add(agent.id);
        return newSet;
      });
      
      // Update agent status in DB
      await supabase
        .from('agents')
        .update({ status: 'running' })
        .eq('id', agent.id);
      
      // Execute agent
      toast.info(`Starting agent: ${agent.name}`);
      
      // Use AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout (increased)
      
      try {
        const result = await startAgent(
          agent.id,
          agent.task_description || '', 
          sessionId,
          browserPort
        );
        
        clearTimeout(timeoutId);
        
        // Store result
        setAgentResults(prev => ({
          ...prev,
          [agent.id]: result
        }));
        
        // Show success/error toast
        if (result.status === 'error') {
          toast.error(`Agent ${agent.name} failed: ${result.error || 'Unknown error'}`);
        } else {
          toast.success(`Agent ${agent.name} completed successfully`);
        }
        
        return result;
      } catch (agentError) {
        clearTimeout(timeoutId);
        console.error('Agent execution error:', agentError);
        toast.error(`Agent execution error: ${agentError.message || 'Unknown error'}`);
        throw agentError;
      }
    } catch (error: any) {
      console.error('Error executing agent:', error);
      toast.error(`Failed to execute agent: ${error.message}`);
      
      // Update agent status to error in DB
      try {
        await supabase
          .from('agents')
          .update({ status: 'error' })
          .eq('id', agent.id);
      } catch (dbError) {
        console.error('Failed to update agent status:', dbError);
      }
      
      throw error;
    } finally {
      // Remove from executing agents
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agent.id);
        return newSet;
      });
      setIsLoading(false);
    }
  }, [executingAgents]);

  const stopAgent = useCallback(async (agent: Agent) => {
    if (!executingAgents.has(agent.id)) {
      return;
    }

    try {
      // Update agent status in DB
      await supabase
        .from('agents')
        .update({ status: 'idle' })
        .eq('id', agent.id);
      
      // Remove from executing agents
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agent.id);
        return newSet;
      });
      
      toast.success(`Agent ${agent.name} stopped`);
    } catch (error: any) {
      console.error('Error stopping agent:', error);
      toast.error(`Failed to stop agent: ${error.message}`);
    }
  }, [executingAgents]);

  return {
    executeAgent,
    stopAgent,
    executingAgents,
    isLoading,
    // Ensure the isExecuting function always returns a boolean
    isExecuting: useCallback((agentId: string): boolean => executingAgents.has(agentId), [executingAgents]),
    getAgentResult: useCallback((agentId: string) => agentResults[agentId], [agentResults])
  };
}
