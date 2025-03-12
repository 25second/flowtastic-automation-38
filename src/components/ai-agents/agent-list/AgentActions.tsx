
import React, { useState } from 'react';
import { Agent } from "@/hooks/ai-agents/useAgents";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  CircleStop,
  Trash, 
  FileText, 
  Edit,
  Star,
  Pencil,
  ScrollText
} from "lucide-react";
import { toast } from "sonner";
import { ViewScriptDialog } from "../agent-dialog/ViewScriptDialog";

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
  const [isViewingScript, setIsViewingScript] = useState(false);

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
    <>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => isRunning ? onStopAgent(agent.id) : onStartAgent(agent.id)}>
          {isRunning ? <CircleStop className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => onEditAgent(agent)} title="Edit Agent Details">
          <Pencil className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => onViewLogs(agent.id)} title="View Agent Logs">
          <FileText className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsViewingScript(true)} 
          title="View Agent Script"
        >
          <ScrollText className="h-4 w-4" />
        </Button>
        
        {onToggleFavorite && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggleFavorite}
            title={agent.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-4 w-4 ${agent.is_favorite ? 'fill-yellow-500' : ''}`} />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          title="Delete Agent"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <ViewScriptDialog
        open={isViewingScript}
        onOpenChange={setIsViewingScript}
        script={agent.script}
        agentName={agent.name}
      />
    </>
  );
}
