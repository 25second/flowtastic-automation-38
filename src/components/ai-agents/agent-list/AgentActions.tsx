
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Square, Trash2, Edit, FileText } from "lucide-react";
import { Agent } from "@/hooks/ai-agents/types";
import { useLanguage } from "@/hooks/useLanguage";

interface AgentActionsProps {
  agent: Agent;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onDeleteAgent: (agentId: string) => void;
  onEditAgent: (agentId: string) => void;
  onViewLogs: (agentId: string) => void;
}

export function AgentActions({
  agent,
  onStartAgent,
  onStopAgent,
  onDeleteAgent,
  onEditAgent,
  onViewLogs
}: AgentActionsProps) {
  const { t } = useLanguage();
  const isRunning = agent.status === 'running';
  
  return (
    <div className="flex justify-end gap-2">
      {isRunning ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStopAgent(agent.id)}
          aria-label="Stop agent"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStartAgent(agent.id)}
          aria-label="Start agent"
        >
          <Play className="h-4 w-4" />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditAgent(agent.id)}>
            <Edit className="mr-2 h-4 w-4" />
            {t('actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewLogs(agent.id)}>
            <FileText className="mr-2 h-4 w-4" />
            {t('actions.viewLogs')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => onDeleteAgent(agent.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
