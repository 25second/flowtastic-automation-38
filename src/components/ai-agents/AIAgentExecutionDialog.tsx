
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Circle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Agent } from '@/hooks/ai-agents/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useLinkenSphere } from '@/hooks/linkenSphere';
import { useAgentExecution } from '@/hooks/ai-agents/useAgentExecution';

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
  const [executionResult, setExecutionResult] = useState<any>(null);
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
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('agents.select_session')}</h3>
            {isLoadingSessions ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : runningSessions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {t('agents.no_running_sessions')}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {runningSessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedSession === session.id ? 'border-primary bg-accent/50' : ''
                    }`}
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      session.status === 'running' || session.status === 'automationRunning' 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {session.status} {session.debug_port && `(Port: ${session.debug_port})`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {executionResult && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('agents.execution_result')}</h3>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {executionResult.steps?.map((step: any, index: number) => (
                    <div key={step.id} className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {step.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                        {step.status === 'pending' && <Circle className="h-4 w-4 text-gray-400" />}
                        {step.status === 'in_progress' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                        <span className="font-medium">Step {index + 1}</span>
                      </div>
                      <p className="text-sm">{step.description}</p>
                      {step.result && (
                        <div className="mt-2 p-2 text-xs bg-accent/50 rounded-md">
                          {step.result}
                        </div>
                      )}
                      {step.screenshot && (
                        <div className="mt-2">
                          <img 
                            src={`/storage/screenshots/${step.screenshot}`} 
                            alt={`Step ${index + 1} screenshot`}
                            className="max-w-full rounded border"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              {t('common.close')}
            </Button>
            
            {isExecuting ? (
              <Button 
                variant="destructive" 
                onClick={handleStopAgent}
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('agents.stop_execution')}
              </Button>
            ) : (
              <Button 
                onClick={handleStartAgent}
                disabled={!selectedSession || isLoadingSessions}
              >
                <Bot className="h-4 w-4 mr-2" />
                {t('agents.start_execution')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
