
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bot } from 'lucide-react';
import { Agent } from '@/hooks/ai-agents/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useLinkenSphere } from '@/hooks/linkenSphere';
import { useAgentExecution } from '@/hooks/ai-agents/useAgentExecution';
import { ExecutionResults } from './agent-execution/ExecutionResults';
import { SessionSelection } from './agent-execution/SessionSelection';
import { ActionButtons } from './agent-execution/ActionButtons';
import { ExecutionResult } from '@/hooks/ai-agents/agent-execution/types';

interface AgentExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
}

export function AIAgentExecutionDialog({
  open,
  onOpenChange,
  agent
}: AgentExecutionDialogProps) {
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  useEffect(() => {
    if (!open) {
      setSelectedSession(null);
      setExecutionResult(null);
      setIsExecuting(false);
    }
  }, [open]);
  
  const { sessions, fetchSessions, loadingSessions } = useLinkenSphere();
  
  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open, fetchSessions]);
  
  const { executeAgent, stopAgent, isExecuting: checkAgentRunning } = useAgentExecution();
  
  useEffect(() => {
    if (agent) {
      // Simply set the execution state based on the boolean returned by checkAgentRunning
      setIsExecuting(checkAgentRunning(agent.id));
    }
  }, [agent, checkAgentRunning]);
  
  const handleStartAgent = async () => {
    if (!agent || !selectedSession) return;
    
    setIsExecuting(true);
    try {
      const result = await executeAgent(agent, selectedSession);
      setExecutionResult(result);
    } catch (error) {
      console.error('Error executing agent:', error);
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleStopAgent = async () => {
    if (!agent) return;
    
    try {
      await stopAgent(agent);
      setIsExecuting(false);
    } catch (error) {
      console.error('Error stopping agent:', error);
    }
  };
  
  const runningSessions = sessions.filter(session => 
    session.status === 'running' || session.status === 'automationRunning'
  );
  
  // Convert loadingSessions Map to a safe boolean for isLoading
  const isLoadingSessions = loadingSessions instanceof Map ? loadingSessions.size > 0 : Boolean(loadingSessions);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: agent?.color || '#9b87f5' }}
            >
              <Bot className="h-4 w-4 text-white" />
            </div>
            {t('agents.execute')} {agent?.name}
          </DialogTitle>
          <DialogDescription>
            {agent?.description || t('agents.execute_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('agents.task')}</h3>
            <div className="p-3 bg-accent/50 rounded-md">
              {agent?.task_description || t('agents.no_task_description')}
            </div>
          </div>
          
          <SessionSelection 
            loadingSessions={isLoadingSessions}
            runningSessions={runningSessions}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
          />
          
          <ExecutionResults executionResult={executionResult} />
          
          <ActionButtons 
            isExecuting={isExecuting}
            onClose={() => onOpenChange(false)}
            onStartAgent={handleStartAgent}
            onStopAgent={handleStopAgent}
            canStart={!!selectedSession}
            isLoading={isLoadingSessions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
