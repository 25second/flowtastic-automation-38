
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from './ai-agents/types';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';
import { startAgent } from '@/utils/agents/startAgent';
import { useAgentErrors } from './ai-agents/useAgentErrors';

export function useAgentExecution() {
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());
  const [agentResults, setAgentResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { clearError, setError, getAgentError } = useAgentErrors();

  // Clean up function to reset any stalled executions
  useEffect(() => {
    const cleanup = async () => {
      try {
        // Find any agents that are stuck in running state
        const { data: runningAgents, error } = await supabase
          .from('agents')
          .select('id, name')
          .eq('status', 'running');

        if (error) {
          console.error('Error checking for running agents:', error);
          return;
        }

        // Reset their status to idle
        if (runningAgents && runningAgents.length > 0) {
          const agentIds = runningAgents.map(agent => agent.id);
          await supabase
            .from('agents')
            .update({ status: 'idle' })
            .in('id', agentIds);
          
          console.log('Reset stalled agent executions:', agentIds);
        }
      } catch (err) {
        console.error('Error in agent execution cleanup:', err);
      }
    };

    cleanup();
  }, []);

  const executeAgent = useCallback(async (agent: Agent, sessionId: string) => {
    if (!agent || !agent.id) {
      toast.error('Invalid agent data');
      return;
    }

    if (executingAgents.has(agent.id)) {
      toast.info('This agent is already running');
      return;
    }

    setIsLoading(true);
    
    // Clear any previous errors for this agent
    clearError(agent.id);

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
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout
      
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
          setError(agent.id, result.error || 'Unknown error');
        } else {
          toast.success(`Agent ${agent.name} completed successfully`);
        }
        
        return result;
      } catch (agentError) {
        clearTimeout(timeoutId);
        
        const errorMessage = agentError instanceof Error ? 
          agentError.message : 
          'Unknown agent execution error';
          
        console.error('Agent execution error:', agentError);
        toast.error(`Agent execution error: ${errorMessage}`);
        
        setError(agent.id, errorMessage);
        
        throw agentError;
      }
    } catch (error: any) {
      console.error('Error executing agent:', error);
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to execute agent';
        
      toast.error(errorMessage);
      
      // Store the error for this agent
      setError(agent.id, errorMessage);
      
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
  }, [executingAgents, clearError, setError]);

  const stopAgent = useCallback(async (agent: Agent) => {
    if (!agent || !agent.id) {
      toast.error('Invalid agent data');
      return;
    }
    
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
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to stop agent';
        
      toast.error(errorMessage);
    }
  }, [executingAgents]);

  return {
    executeAgent,
    stopAgent,
    executingAgents,
    isLoading,
    isExecuting: useCallback((agentId: string): boolean => 
      !!agentId && executingAgents.has(agentId), 
    [executingAgents]),
    getAgentResult: useCallback((agentId: string) => 
      agentId ? agentResults[agentId] : undefined, 
    [agentResults]),
    getAgentError
  };
}
