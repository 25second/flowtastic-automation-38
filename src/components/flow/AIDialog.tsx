
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
        fetch('https://api.studio.nebius.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nebiusKey}`
          },
          body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant that generates workflow automation scripts based on user prompts.
                Available node types: ${JSON.stringify(availableNodes)}.
                Generate a JSON response with nodes and edges that can be used with React Flow.
                Response format:
                {
                  "nodes": [
                    {
                      "id": string,
                      "type": string (must be one of available node types),
                      "data": { "label": string, "settings": object },
                      "position": { "x": number, "y": number }
                    }
                  ],
                  "edges": [
                    {
                      "id": string,
                      "source": string (node id),
                      "target": string (node id)
                    }
                  ]
                }`
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 512,
            temperature: 0.6,
            top_p: 0.9,
            extra_body: {
              top_k: 50
            }
          })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to generate flow');
          const data = await res.json();
          
          // Parse the generated content from the response
          const generatedFlow = JSON.parse(data.choices[0].message.content);
          
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
