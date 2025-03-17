
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from './types';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';
import { startAgent } from '@/utils/agents/startAgent';

export function useAgentExecution() {
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());
  const [agentResults, setAgentResults] = useState<Record<string, any>>({});

  const executeAgent = useCallback(async (agent: Agent, sessionId: string) => {
    if (!agent?.id || !sessionId) {
      toast.error('Missing agent ID or session ID');
      return null;
    }

    if (executingAgents.has(agent.id)) {
      toast.info('This agent is already running');
      return agentResults[agent.id] || null;
    }

    try {
      console.log(`Starting agent execution for ${agent.name} with session ${sessionId}`);
      
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
      
      const result = await startAgent(
        agent.id,
        agent.task_description || '', 
        sessionId,
        browserPort
      );
      
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
    } catch (error: any) {
      console.error('Error executing agent:', error);
      toast.error(`Failed to execute agent: ${error.message}`);
      
      // Update agent status to error in DB
      await supabase
        .from('agents')
        .update({ status: 'error' })
        .eq('id', agent.id);
      
      throw error;
    } finally {
      // Remove from executing agents
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agent.id);
        return newSet;
      });
    }
  }, [executingAgents, agentResults]);

  const stopAgent = useCallback(async (agent: Agent) => {
    if (!agent?.id) return;
    
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
    isExecuting: useCallback((agentId: string): boolean => 
      executingAgents.has(agentId), [executingAgents]),
    getAgentResult: useCallback((agentId: string) => 
      agentResults[agentId], [agentResults])
  };
}
