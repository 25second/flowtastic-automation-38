
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/types/task";

interface TaskLogsProps {
  selectedTaskLogs: { id: string; logs: string[] } | null;
  onClose: () => void;
}

export function TaskLogs({ selectedTaskLogs, onClose }: TaskLogsProps) {
  const handleDownloadLogs = () => {
    if (!selectedTaskLogs) return;
    
    const logsText = selectedTaskLogs.logs.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${selectedTaskLogs.id}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={!!selectedTaskLogs} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Task Logs</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-12rem)] mt-6 rounded border p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {selectedTaskLogs?.logs.map((log, index) => (
              <div key={index} className="py-1">
                {log}
              </div>
            ))}
          </pre>
        </ScrollArea>
        <div className="mt-6">
          <Button 
            onClick={handleDownloadLogs}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Logs
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
