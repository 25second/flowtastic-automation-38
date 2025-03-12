
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ViewScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: string | undefined;
  agentName: string;
}

export function ViewScriptDialog({
  open,
  onOpenChange,
  script,
  agentName
}: ViewScriptDialogProps) {
  const copyToClipboard = () => {
    if (script) {
      navigator.clipboard.writeText(script);
      toast.success("Script copied to clipboard");
    }
  };

  // Detect script language (simple heuristic)
  const isPythonScript = script?.includes('import') && 
                        (script?.includes('async def') || script?.includes('def '));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Script for agent: {agentName}</DialogTitle>
            <Badge variant="outline" className="ml-2">
              {isPythonScript ? "Python" : "JavaScript"}
            </Badge>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {isPythonScript && (
            <div className="text-sm text-muted-foreground">
              <p>This agent uses Python with browser-use library to automate browser interactions.</p>
            </div>
          )}
          <ScrollArea className="h-[500px] w-full rounded-md border">
            <pre className="text-sm font-mono whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto">
              {script || 'No script available'}
            </pre>
          </ScrollArea>
          <div className="flex justify-end">
            <Button onClick={copyToClipboard} variant="secondary">
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
