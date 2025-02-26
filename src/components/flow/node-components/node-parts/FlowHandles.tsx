
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
  const handleClass = "!w-3 !h-1.5 !rounded-full !bg-background hover:!bg-primary !border-[1px] !border-primary hover:!shadow-[0_0_10px_hsl(var(--primary)_/_0.5)]";

  if (isStartScript) {
    return (
      <div className="relative h-8 flex items-center justify-between px-4">
        <div className="flex items-center ml-auto">
          <span className="text-xs text-muted-foreground mr-2">Out</span>
          <Handle
            type="source"
            position={Position.Right}
            className={handleClass}
            style={{ right: -8 }}
            id="flow"
          />
        </div>
      </div>
    );
  }

  if (isStop) {
    return (
      <Handle
        type="target"
        position={Position.Left}
        className={handleClass}
        style={{ left: -8 }}
        id="flow"
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
            className={handleClass}
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
            className={handleClass}
            style={{ right: -8 }}
            id="flow"
          />
        </div>
      </div>
    );
  }

  return null;
};
