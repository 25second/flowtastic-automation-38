
import { Button } from "@/components/ui/button";
import { Play, Square, Trash2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AgentBulkActionsProps {
  selectedAgentsCount: number;
  onBulkStart: () => void;
  onBulkStop: () => void;
  onBulkDelete: () => void;
}

export function AgentBulkActions({
  selectedAgentsCount,
  onBulkStart,
  onBulkStop,
  onBulkDelete
}: AgentBulkActionsProps) {
  const { t } = useLanguage();
  
  if (selectedAgentsCount === 0) return null;
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground ml-2">
        {selectedAgentsCount} {selectedAgentsCount === 1 ? t('agents.selected.singular') : t('agents.selected.plural')}
      </span>
      
      <div className="flex-1"></div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBulkStart}
        className="gap-1"
      >
        <Play className="h-4 w-4" />
        {t('actions.start')}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBulkStop}
        className="gap-1"
      >
        <Square className="h-4 w-4" />
        {t('actions.stop')}
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={onBulkDelete}
        className="gap-1"
      >
        <Trash2 className="h-4 w-4" />
        {t('actions.delete')}
      </Button>
    </div>
  );
}
