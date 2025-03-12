
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { Agent } from "@/hooks/ai-agents/useAgents";
import { AddAgentDialog } from "./AddAgentDialog";
import { AgentSearchBar } from "./agent-list/AgentSearchBar";
import { AgentBulkActions } from "./agent-list/AgentBulkActions";
import { AgentTable } from "./agent-list/AgentTable";
import { useLanguage } from "@/hooks/useLanguage";

interface AgentListViewProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  selectedAgents: Set<string>;
  filteredAgents: Agent[];
  onSelectAgent: (agentId: string) => void;
  onSelectAll: () => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onDeleteAgent: (agentId: string) => void;
  onToggleFavorite?: (agentId: string, isFavorite: boolean) => Promise<void>;
  onBulkStart: () => void;
  onBulkStop: () => void;
  onBulkDelete: () => void;
  fetchAgents: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

export function AgentListView({
  searchQuery,
  onSearchChange,
  isAddDialogOpen,
  setIsAddDialogOpen,
  selectedAgents,
  filteredAgents,
  onSelectAgent,
  onSelectAll,
  onStartAgent,
  onStopAgent,
  onDeleteAgent,
  onToggleFavorite,
  onBulkStart,
  onBulkStop,
  onBulkDelete,
  fetchAgents,
  showFavorites,
  onToggleFavorites
}: AgentListViewProps) {
  const { t } = useLanguage();
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <AgentSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange} 
        />
        <div className="flex gap-2">
          <Button
            variant={showFavorites ? "default" : "outline"}
            onClick={onToggleFavorites}
            className="gap-2"
          >
            <Star className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            {t('favorites.title')}
          </Button>
          
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('agents.create')}
          </Button>
        </div>
      </div>

      <AgentBulkActions 
        selectedAgentsCount={selectedAgents.size}
        onBulkStart={onBulkStart}
        onBulkStop={onBulkStop}
        onBulkDelete={onBulkDelete}
      />

      <AgentTable 
        agents={filteredAgents}
        selectedAgents={selectedAgents}
        onSelectAgent={onSelectAgent}
        onSelectAll={onSelectAll}
        onStartAgent={onStartAgent}
        onStopAgent={onStopAgent}
        onDeleteAgent={onDeleteAgent}
        onEditAgent={() => {}}
        onViewLogs={() => {}}
        onToggleFavorite={onToggleFavorite}
      />

      <AddAgentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAgentAdded={fetchAgents}
      />
    </div>
  );
}
