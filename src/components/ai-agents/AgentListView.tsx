
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/hooks/ai-agents/useAgents";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AgentActions } from "./agent-list/AgentActions";

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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents by name, status, or dates..."
            className="pl-9"
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={areAllSelected}
                // Используем класс для визуального обозначения частичного выбора
                // вместо несуществующего атрибута indeterminate
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                className={selectedAgents.size > 0 && !areAllSelected ? "opacity-50" : ""}
              />
            </TableHead>
            <TableHead>Agent Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No agents found
              </TableCell>
            </TableRow>
          ) : (
            filteredAgents.map((agent) => {
              const isSelected = selectedAgents.has(agent.id);
              
              return (
                <TableRow key={agent.id}>
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => onSelectAgent(agent.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      agent.status === 'running' 
                        ? 'bg-orange-100 text-orange-700'
                        : agent.status === 'completed'
                        ? 'bg-[#D3E4FD] text-blue-700' 
                        : agent.status === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-[#F2FCE2] text-green-700'
                    }`}>
                      {agent.status === 'running' && (
                        <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
                      )}
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(agent.created_at), "MMM dd, yyyy, h:mm a")}
                  </TableCell>
                  <TableCell>
                    {agent.updated_at ? format(new Date(agent.updated_at), "MMM dd, yyyy, h:mm a") : "-"}
                  </TableCell>
                  <TableCell>
                    <AgentActions
                      agent={agent}
                      onViewLogs={() => {}}
                      onStartAgent={() => onStartAgent(agent.id)}
                      onStopAgent={() => onStopAgent(agent.id)}
                      onEditAgent={() => {}}
                      onDeleteAgent={() => onDeleteAgent(agent.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

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
