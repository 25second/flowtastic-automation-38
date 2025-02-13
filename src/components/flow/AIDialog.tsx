
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { nodeTypes } from './CustomNode';

interface AIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
}

export const AIDialog = ({ 
  open, 
  onOpenChange, 
  prompt, 
  setPrompt,
  setNodes,
  setEdges 
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
        fetch('http://localhost:3001/generate-with-ai', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
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
          
          setNodes(generatedFlow.nodes);
          setEdges(generatedFlow.edges);
          
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
