import { useState } from 'react';
import { Row } from "@tanstack/react-table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Square, Edit, Trash2, FileCode, Star } from "lucide-react";
import { Agent } from "@/hooks/ai-agents/types";
import { useLanguage } from "@/hooks/useLanguage";
import { AIAgentExecutionDialog } from "../AIAgentExecutionDialog";
import { ViewScriptDialog } from "../agent-dialog/ViewScriptDialog";

interface AgentActionsProps {
  row: Row<Agent>;
  onStartAgent: () => void;
  onStopAgent: () => void;
  onDeleteAgent: () => void;
  onEditAgent?: () => void;
  onViewLogs?: () => void;
  onToggleFavorite?: (agentId: string, isFavorite: boolean) => void;
}

export function AgentActions({
  row,
  onStartAgent,
  onStopAgent,
  onDeleteAgent,
  onEditAgent,
  onViewLogs,
  onToggleFavorite
}: AgentActionsProps) {
  const { t } = useLanguage();
  const agent = row.original;
  
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {agent.status === 'idle' ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowExecuteDialog(true)}
            title={t('agents.start')}
          >
            <Play className="h-4 w-4 text-green-500" />
          </Button>
        ) : agent.status === 'running' ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onStopAgent(agent.id)}
            title={t('agents.stop')}
          >
            <Square className="h-4 w-4 text-red-500" />
          </Button>
        ) : null}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {agent.status === 'idle' && (
              <DropdownMenuItem onClick={() => setShowExecuteDialog(true)}>
                <Play className="h-4 w-4 mr-2 text-green-500" />
                {t('agents.start')}
              </DropdownMenuItem>
            )}
            
            {agent.status === 'running' && (
              <DropdownMenuItem onClick={() => onStopAgent(agent.id)}>
                <Square className="h-4 w-4 mr-2 text-red-500" />
                {t('agents.stop')}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => setShowScriptDialog(true)}>
              <FileCode className="h-4 w-4 mr-2" />
              {t('agents.view_script')}
            </DropdownMenuItem>
            
            {onToggleFavorite && (
              <DropdownMenuItem onClick={() => onToggleFavorite(agent.id, !agent.is_favorite)}>
                <Star className={`h-4 w-4 mr-2 ${agent.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {agent.is_favorite ? t('favorites.remove') : t('favorites.add')}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {onEditAgent && (
              <DropdownMenuItem onClick={onEditAgent}>
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit')}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem 
              onClick={() => onDeleteAgent(agent.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <AIAgentExecutionDialog
        open={showExecuteDialog}
        onOpenChange={setShowExecuteDialog}
        agent={agent}
      />
      
      <ViewScriptDialog
        open={showScriptDialog}
        onOpenChange={setShowScriptDialog}
        script={agent.script || ''}
        agentName={agent.name}
      />
    </>
  );
}
