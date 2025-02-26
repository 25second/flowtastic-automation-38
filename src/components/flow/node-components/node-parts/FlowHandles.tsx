
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface FlowHandlesProps {
  isStartScript?: boolean;
  isStop?: boolean;
  showFlowPoints?: boolean;
}

export const FlowHandles: React.FC<FlowHandlesProps> = ({
  isStartScript,
  isStop,
  showFlowPoints
}) => {
  if (isStartScript) {
    return (
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-1 !bg-primary"
        style={{ right: -8 }}
      />
    );
  }

  if (isStop) {
    return (
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-1 !bg-primary"
        style={{ left: -8 }}
      />
    );
  }

  if (showFlowPoints) {
    return (
      <div className="relative h-8 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Handle
            type="target"
            position={Position.Left}
            className="w-2 h-1 !bg-primary"
            style={{ left: -8 }}
            id="flow"
          />
          <span className="text-xs text-muted-foreground ml-2">In</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground mr-2">Out</span>
          <Handle
            type="source"
            position={Position.Right}
            className="w-2 h-1 !bg-primary"
            style={{ right: -8 }}
            id="flow"
          />
        </div>
      </div>
    );
  }

  return null;
};
