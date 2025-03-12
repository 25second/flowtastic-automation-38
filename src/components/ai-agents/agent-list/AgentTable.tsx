
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
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

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
  onToggleFavorite?: (agentId: string, isFavorite: boolean) => Promise<void>;
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
  const { t } = useLanguage();
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
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              {t('agents.noAgents')}
            </TableCell>
          </TableRow>
        ) : (
          agents.map((agent) => {
            const isSelected = selectedAgents.has(agent.id);
            
            return (
              <TableRow key={agent.id} className="group">
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelectAgent(agent.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      {agent.name}
                    </div>
                    {agent.description && <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <AgentStatusBadge status={agent.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(agent.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {agent.updated_at ? format(new Date(agent.updated_at), "MMM dd, yyyy") : "-"}
                </TableCell>
                <TableCell>
                  {agent.category_id && (
                    <Badge variant="secondary">{agent.category_id}</Badge>
                  )}
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
