
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkflowExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBrowser: { id: string; status: string; debug_port?: number } | number | null;
  selectedServer: string | null;
}

export const WorkflowExecutionDialog = ({
  open,
  onOpenChange,
  selectedBrowser,
  selectedServer
}: WorkflowExecutionDialogProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'preparing' | 'running' | 'completed' | 'error'>('preparing');
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      // Reset logs when dialog opens
      setLogs([]);
      setStatus('preparing');
      
      // Add initial logs with more detailed browser information
      setLogs(prev => [...prev, 
        t('workflow.execution.started'),
        `${t('workflow.execution.server')}: ${selectedServer || t('workflow.execution.notSelected')}`,
        `${t('workflow.execution.browser')}: ${selectedBrowser ? 
          (typeof selectedBrowser === 'object' ? 
            `LinkenSphere ${t('workflow.execution.session')} (${selectedBrowser.id}) - ${t('workflow.execution.debugPort')}: ${selectedBrowser.debug_port}` : 
            `Chrome (${t('workflow.execution.port')}: ${selectedBrowser})`) :
          t('workflow.execution.notSelected')
        }`,
        t('workflow.execution.initializing')
      ]);

      // Update status to running
      setStatus('running');
    }
  }, [open, selectedBrowser, selectedServer, t]);

  const getStatusLabel = (statusKey: 'preparing' | 'running' | 'completed' | 'error') => {
    const statusMap = {
      'preparing': t('workflow.status.preparing'),
      'running': t('workflow.status.running'),
      'completed': t('workflow.status.completed'),
      'error': t('workflow.status.error')
    };
    return statusMap[statusKey];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('workflow.execution.title')}</DialogTitle>
            <Badge 
              variant={status === 'running' ? 'default' : 
                      status === 'completed' ? 'secondary' :
                      status === 'error' ? 'destructive' : 
                      'outline'}
              className="ml-2"
            >
              {getStatusLabel(status)}
            </Badge>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] w-full rounded-md border bg-black p-4">
          <div className="font-mono text-sm text-white space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <Terminal className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
