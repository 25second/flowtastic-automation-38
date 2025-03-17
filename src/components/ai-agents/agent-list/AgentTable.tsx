
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Agent } from "@/hooks/ai-agents/types";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { AgentActions } from "./AgentActions";
import { useLanguage } from "@/hooks/useLanguage";
import { Star } from "lucide-react";

interface AgentTableProps {
  agents: Agent[];
  selectedAgents: Set<string>;
  onSelectAgent: (agentId: string) => void;
  onSelectAll: () => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
  onDeleteAgent: (agentId: string) => void;
  onEditAgent: (agentId: string) => void;
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
  const { t } = useLanguage();
  
  // Check if all visible agents are selected
  const allSelected = agents.length > 0 && agents.every(agent => selectedAgents.has(agent.id));
  // Check if some but not all agents are selected
  const someSelected = !allSelected && agents.some(agent => selectedAgents.has(agent.id));
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected} 
                indeterminate={someSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all agents"
              />
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>{t('agents.table.name')}</TableHead>
            <TableHead>{t('agents.table.status')}</TableHead>
            <TableHead>{t('agents.table.category')}</TableHead>
            <TableHead className="text-right">{t('agents.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map(agent => (
            <TableRow key={agent.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedAgents.has(agent.id)}
                  onCheckedChange={() => onSelectAgent(agent.id)}
                  aria-label={`Select ${agent.name} agent`}
                />
              </TableCell>
              <TableCell>
                {onToggleFavorite && (
                  <button 
                    onClick={() => onToggleFavorite(agent.id, !agent.is_favorite)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Star 
                      className={`h-4 w-4 ${agent.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                    />
                  </button>
                )}
              </TableCell>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>
                <AgentStatusBadge status={agent.status} />
              </TableCell>
              <TableCell>{agent.category_name || '—'}</TableCell>
              <TableCell className="text-right">
                <AgentActions
                  agent={agent}
                  onStartAgent={onStartAgent}
                  onStopAgent={onStopAgent}
                  onDeleteAgent={onDeleteAgent}
                  onEditAgent={onEditAgent}
                  onViewLogs={onViewLogs}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
