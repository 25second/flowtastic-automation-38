
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TableSelector } from './TableSelector';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebVoyagerAgent } from '@/hooks/ai-agents/useWebVoyagerAgent';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Bot, Table } from 'lucide-react';

interface RunAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
  sessionId?: string;
  browserPort?: number;
  tables?: Array<{ id: string; name: string }>;
}

export function RunAgentDialog({
  open,
  onOpenChange,
  agentName,
  sessionId,
  browserPort,
  tables = []
}: RunAgentDialogProps) {
  const [task, setTask] = useState('');
  const [selectedTable, setSelectedTable] = useState('none');
  
  const {
    runAgent,
    isRunning,
    progress,
    logs,
    error
  } = useWebVoyagerAgent({ sessionId, browserPort });
  
  const handleRun = async () => {
    if (!task.trim()) return;
    
    await runAgent(
      task,
      selectedTable !== 'none' ? selectedTable : undefined
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => !isRunning && onOpenChange(value)}>
      <DialogContent className="max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> Run Agent: {agentName}
          </DialogTitle>
          <DialogDescription>
            Specify the task for the agent to perform in the browser
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="task">Task Description</Label>
            <Textarea
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe what you want the agent to do, e.g. 'Register an Outlook email account'"
              rows={3}
              disabled={isRunning}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <TableSelector
              tables={tables}
              isLoading={false}
              selectedTable={selectedTable}
              onTableChange={setSelectedTable}
            />
            <p className="text-xs text-muted-foreground">
              Select a table where the agent will store the results
            </p>
          </div>
          
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <Badge variant="outline">{progress}%</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {logs.length > 0 && (
            <div className="space-y-2">
              <Label>Execution Logs</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-2 bg-slate-50 dark:bg-slate-900">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`py-1 ${log.includes('Error') ? 'text-red-500' : ''}`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md dark:bg-red-950/30">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isRunning}
              className="sm:mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRun}
              disabled={isRunning || !task.trim()}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Agent
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
