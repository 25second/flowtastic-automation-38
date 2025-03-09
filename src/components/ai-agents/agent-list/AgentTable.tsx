
import React from 'react';
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/hooks/ai-agents/useAgents";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AgentActions } from "./AgentActions";
import { AgentStatusBadge } from "./AgentStatusBadge";

interface AgentTableProps {
  agents: Agent[];
  selectedAgents: Set<string>;
  onSelectAgent: (agentId: string) => void;
  onSelectAll: () => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onDeleteAgent: (agentId: string) => void;
  onEditAgent: (agent: Agent) => void;
  onViewLogs: (agentId: string) => void;
  onToggleFavorite?: (agentId: string, isFavorite: boolean) => void;
}

export function AgentTable({
  agents,
  selectedAgents,
  onSelectAgent,
  onSelectAll,
  onStartAgent,
  onStopAgent,
  onDeleteAgent,
  onEditAgent,
  onViewLogs,
  onToggleFavorite
}: AgentTableProps) {
  const areAllSelected = agents.length > 0 && selectedAgents.size === agents.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={areAllSelected}
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
        {agents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              No agents found
            </TableCell>
          </TableRow>
        ) : (
          agents.map((agent) => {
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
                  <AgentStatusBadge status={agent.status} />
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
                    onViewLogs={onViewLogs}
                    onStartAgent={onStartAgent}
                    onStopAgent={onStopAgent}
                    onEditAgent={onEditAgent}
                    onDeleteAgent={onDeleteAgent}
                    onToggleFavorite={onToggleFavorite}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
