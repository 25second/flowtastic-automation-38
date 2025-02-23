
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edge } from '@xyflow/react';
import { generateScript } from '@/utils/scriptGenerator';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FlowNodeWithData } from "@/types/flow";

interface ScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: FlowNodeWithData[];
  edges: Edge[];
}

export const ScriptDialog = ({ open, onOpenChange, nodes, edges }: ScriptDialogProps) => {
  const script = generateScript(nodes, edges);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Generated Puppeteer Script</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>To run this script:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Install puppeteer-core: <code className="bg-muted px-1">npm install puppeteer-core</code></li>
              <li>Replace <code className="bg-muted px-1">YOUR_PORT</code> with your browser's debug port</li>
              <li>Save as <code className="bg-muted px-1">script.js</code> and run with <code className="bg-muted px-1">node script.js</code></li>
            </ol>
          </div>
          <ScrollArea className="h-[500px] w-full rounded-md border">
            <pre className="text-sm font-mono whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-auto">
              {script}
            </pre>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button onClick={copyToClipboard} variant="secondary">
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
