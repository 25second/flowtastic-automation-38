
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/hooks/ai-agents/useAgents";
import { AgentListItem } from "./agent-list/AgentListItem";

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
  onBulkStart: () => void;
  onBulkStop: () => void;
  onBulkDelete: () => void;
  fetchAgents: () => void;
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
  onBulkStart,
  onBulkStop,
  onBulkDelete,
  fetchAgents
}: AgentListViewProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const areAllSelected = 
    filteredAgents.length > 0 && selectedAgents.size === filteredAgents.length;
  
  const areSomeSelected = selectedAgents.size > 0 && !areAllSelected;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {selectedAgents.size > 0 && (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={onBulkStart}
          >
            Start Selected
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onBulkStop}
          >
            Stop Selected
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={onBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <div className="grid">
          <div className="grid grid-cols-12 gap-2 border-b bg-muted/40 p-4">
            <div className="col-span-1 flex items-center">
              <Checkbox 
                checked={areAllSelected} 
                indeterminate={areSomeSelected}
                onCheckedChange={onSelectAll} 
                aria-label="Select all"
              />
            </div>
            <div className="col-span-4 font-medium">Name</div>
            <div className="col-span-2 font-medium">Status</div>
            <div className="col-span-3 font-medium">Created</div>
            <div className="col-span-2 font-medium">Actions</div>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No agents found
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <AgentListItem
                key={agent.id}
                agent={agent}
                isSelected={selectedAgents.has(agent.id)}
                onSelect={() => onSelectAgent(agent.id)}
                onStart={() => onStartAgent(agent.id)}
                onStop={() => onStopAgent(agent.id)}
                onDelete={() => onDeleteAgent(agent.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* TODO: Add dialog for creating new agents */}
      {/* {isAddDialogOpen && (
        <AddAgentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAgentAdded={fetchAgents}
        />
      )} */}
    </div>
  );
}
