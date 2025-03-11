
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Script for agent: {agentName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
