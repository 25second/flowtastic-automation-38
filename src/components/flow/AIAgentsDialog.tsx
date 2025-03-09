
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { Agent } from '@/hooks/ai-agents/types';
import { PlusCircle, Bot, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlowNodeWithData } from '@/types/flow';

interface AIAgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addAgentAsNode: (agent: Agent) => void;
}

export function AIAgentsDialog({
  open,
  onOpenChange,
  addAgentAsNode
}: AIAgentsDialogProps) {
  const { session } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open && session?.user?.id) {
      fetchAgents();
    }
  }, [open, session?.user?.id]);

  const fetchAgents = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (agent: Agent) => {
    addAgentAsNode(agent);
    toast.success(`Added agent "${agent.name}" to workflow`);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border bg-background shadow-lg rounded-lg my-0">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">AI Agents</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? 'No agents found matching your search' : 'No agents available'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAgents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      {agent.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => handleAdd(agent)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
