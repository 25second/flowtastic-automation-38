
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
      </DialogContent>
    </Dialog>
  );
};
