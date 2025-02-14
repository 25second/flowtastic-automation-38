
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { nodeTypes } from './CustomNode';
import { Edge } from "@xyflow/react";
import { FlowNodeWithData } from "@/types/flow";

interface AIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (flow: { nodes: FlowNodeWithData[]; edges: Edge[] }) => Promise<void>;
}

export const AIDialog = ({ 
  open, 
  onOpenChange, 
  prompt, 
  setPrompt,
  onGenerate 
}: AIDialogProps) => {
  const handleAICreate = async () => {
    const nebiusKey = localStorage.getItem('nebiusKey');
    
    if (!nebiusKey) {
      toast.error('Please set your Nebius API key in Settings');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      const availableNodes = Object.keys(nodeTypes);

      toast.promise(
        fetch('/supabase/functions/generate-with-ai', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nebiusKey}`
          },
          body: JSON.stringify({ 
            prompt,
            availableNodes,
            nebiusKey
          })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to generate flow');
          const generatedFlow = await res.json();
          
          await onGenerate(generatedFlow);
          
          onOpenChange(false);
          setPrompt('');
        }),
        {
          loading: 'Generating flow...',
          success: 'Flow generated successfully!',
          error: 'Failed to generate flow'
        }
      );
    } catch (error) {
      console.error('Error generating flow:', error);
      toast.error('Failed to generate flow');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Flow with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Describe the workflow automation you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAICreate();
                }
              }}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleAICreate}>Generate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
