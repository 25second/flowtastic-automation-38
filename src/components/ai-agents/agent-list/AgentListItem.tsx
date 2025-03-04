
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/hooks/ai-agents/useAgents";
import { formatDistance } from "date-fns";
import { Play, StopCircle, Trash2 } from "lucide-react";

interface AgentListItemProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export function AgentListItem({
  agent,
  isSelected,
  onSelect,
  onStart,
  onStop,
  onDelete
}: AgentListItemProps) {
  const createdAtFormatted = formatDistance(
    new Date(agent.created_at),
    new Date(),
    { addSuffix: true }
  );

  return (
    <div className="grid grid-cols-12 gap-2 border-b p-4 items-center last:border-0">
      <div className="col-span-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select agent ${agent.name}`}
        />
      </div>
      <div className="col-span-4 font-medium">{agent.name}</div>
      <div className="col-span-2">
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          agent.status === 'running' 
            ? 'bg-green-100 text-green-800'
            : agent.status === 'completed'
            ? 'bg-blue-100 text-blue-800' 
            : agent.status === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </div>
      </div>
      <div className="col-span-3 text-sm text-muted-foreground">
        {createdAtFormatted}
      </div>
      <div className="col-span-2 flex space-x-1">
        {agent.status !== 'running' ? (
          <Button variant="ghost" size="icon" onClick={onStart} title="Start agent">
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onStop} title="Stop agent">
            <StopCircle className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onDelete} title="Delete agent">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
