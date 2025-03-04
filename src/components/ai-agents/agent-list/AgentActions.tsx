
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash, Edit, Terminal, Star } from "lucide-react";
import { useState } from "react";
import type { Agent } from "@/hooks/ai-agents/useAgents";

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
  const isRunning = agent.status === "running";

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(agent.id, !agent.is_favorite);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className="text-yellow-500"
        >
          <Star className={`h-4 w-4 ${agent.is_favorite ? 'fill-yellow-500' : ''}`} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewLogs(agent.id)}
      >
        <Terminal className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => isRunning ? onStopAgent(agent.id) : onStartAgent(agent.id)}
      >
        {isRunning ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditAgent(agent)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteAgent(agent.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
