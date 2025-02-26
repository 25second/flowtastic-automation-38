
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
      <div className="relative h-8 flex items-center justify-between px-4">
        <div className="flex items-center ml-auto">
          <span className="text-xs text-muted-foreground mr-2">Out</span>
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
            style={{ right: -8 }}
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
        className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
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
            className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
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
            className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
            style={{ right: -8 }}
            id="flow"
          />
        </div>
      </div>
    );
  }

  return null;
};
