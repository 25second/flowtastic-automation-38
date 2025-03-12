
import { useState } from 'react';
import { MoreHorizontal, Play, Star, Trash, Eye, Edit, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Agent } from '@/hooks/ai-agents/types';
import { ViewScriptDialog } from '../agent-dialog/ViewScriptDialog';
import { RunAgentDialog } from '../agent-dialog/RunAgentDialog';
import { toast } from 'sonner';

interface AgentActionsProps {
  agent: Agent;
  onDelete: (agentId: string) => Promise<void>;
  onEdit?: (agent: Agent) => void;
  onToggleFavorite: (agentId: string) => Promise<void>;
  onStart: (agentId: string) => Promise<void>;
  onStop: (agentId: string) => Promise<void>;
  tables?: Array<{ id: string; name: string }>;
}

export function AgentActions({ 
  agent, 
  onDelete, 
  onEdit, 
  onToggleFavorite, 
  onStart, 
  onStop,
  tables = []
}: AgentActionsProps) {
  const [isViewScriptOpen, setIsViewScriptOpen] = useState(false);
  const [isRunAgentOpen, setIsRunAgentOpen] = useState(false);

  const isRunning = agent.status === 'running';

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the agent "${agent.name}"?`)) {
      await onDelete(agent.id);
    }
  };

  // Получение порта для подключения к браузеру
  const [browserPort, setBrowserPort] = useState<number | undefined>(() => {
    const savedPort = localStorage.getItem(`session_${agent.id}_port`);
    return savedPort ? parseInt(savedPort) : 9222; // Стандартный порт для CDP
  });

  const handleRun = () => {
    if (!browserPort) {
      toast.error("Browser session not configured. Please set up a browser session with remote debugging enabled.");
      return;
    }
    setIsRunAgentOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRun}>
            <Play className="mr-2 h-4 w-4" />
            <span>Run with Web Voyager</span>
          </DropdownMenuItem>
          
          {isRunning ? (
            <DropdownMenuItem onClick={() => onStop(agent.id)}>
              <StopCircle className="mr-2 h-4 w-4" />
              <span>Stop</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onStart(agent.id)}>
              <Play className="mr-2 h-4 w-4" />
              <span>Start</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => setIsViewScriptOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Script</span>
          </DropdownMenuItem>
          
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(agent)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => onToggleFavorite(agent.id)}>
            <Star className={`mr-2 h-4 w-4 ${agent.is_favorite ? 'fill-yellow-400' : ''}`} />
            <span>{agent.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewScriptDialog
        open={isViewScriptOpen}
        onOpenChange={setIsViewScriptOpen}
        script={agent.script}
        agentName={agent.name}
      />
      
      <RunAgentDialog
        open={isRunAgentOpen}
        onOpenChange={setIsRunAgentOpen}
        agentName={agent.name}
        sessionId={agent.id}
        browserPort={browserPort}
        tables={tables}
      />
    </>
  );
}
