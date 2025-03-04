
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash, Edit, Terminal } from "lucide-react";
import { useState } from "react";
import type { Agent } from "@/hooks/ai-agents/useAgents";

interface AgentActionsProps {
  agent: Agent;
  onViewLogs: (agentId: string) => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
}

export function AgentActions({
  agent,
  onViewLogs,
  onStartAgent,
  onStopAgent,
  onEditAgent,
  onDeleteAgent
}: AgentActionsProps) {
  const isRunning = agent.status === "running";

  return (
    <div className="flex items-center justify-end gap-2">
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
