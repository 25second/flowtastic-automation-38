
import React from 'react';
import { Agent } from "@/hooks/ai-agents/useAgents";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  CircleStop,
  Trash, 
  FileText, 
  Edit,
  Star
} from "lucide-react";
import { toast } from "sonner";

interface AgentActionsProps {
  agent: Agent;
  onViewLogs: (agentId: string) => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
  onToggleFavorite?: (agentId: string, isFavorite: boolean) => void;
}

export function AgentActions({
  agent,
  onViewLogs,
  onStartAgent,
  onStopAgent,
  onEditAgent,
  onDeleteAgent,
  onToggleFavorite
}: AgentActionsProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete agent "${agent.name}"?`)) {
      onDeleteAgent(agent.id);
      toast.success(`Agent "${agent.name}" deleted successfully`);
    }
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(agent.id, !agent.is_favorite);
      toast.success(`Agent "${agent.name}" ${agent.is_favorite ? 'removed from' : 'added to'} favorites`);
    }
  };

  const isRunning = agent.status === 'running';

  return (
    <div className="flex justify-end gap-2">
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleFavorite}
        >
          <Star 
            className={`h-4 w-4 ${agent.is_favorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
          />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEditAgent(agent)}
      >
        <Edit className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onViewLogs(agent.id)}
      >
        <FileText className="h-4 w-4 text-muted-foreground" />
      </Button>
      
      {isRunning ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600"
          onClick={() => onStopAgent(agent.id)}
        >
          <CircleStop className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-600"
          onClick={() => onStartAgent(agent.id)}
        >
          <Play className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:text-red-600"
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
