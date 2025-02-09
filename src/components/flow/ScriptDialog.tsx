
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node, Edge } from '@xyflow/react';
import { generateScript } from '@/utils/scriptGenerator';

interface ScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
}

export const ScriptDialog = ({ open, onOpenChange, nodes, edges }: ScriptDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Generated Workflow Script</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {generateScript(nodes, edges)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
