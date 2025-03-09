
import React from 'react';
import { Button } from "@/components/ui/button";

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
  if (selectedAgentsCount === 0) {
    return null;
  }

  return (
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
  );
}
