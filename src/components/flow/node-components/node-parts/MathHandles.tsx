
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface MathHandlesProps {
  inputs?: { id: string; label: string }[];
  outputs?: { id: string; label: string }[];
}

export const MathHandles: React.FC<MathHandlesProps> = ({ inputs, outputs }) => {
  if (!inputs && !outputs) return null;

  return (
    <>
      <div>
        {inputs?.map((input) => (
          <div key={input.id} className="relative flex items-center justify-between h-8">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary"
              style={{ left: -8 }}
            />
            <span className="text-xs text-muted-foreground ml-4">{input.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2">
        {outputs?.map((output) => (
          <div key={output.id} className="relative flex items-center justify-between h-8">
            <span className="text-xs text-muted-foreground">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary"
              style={{ right: -8 }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
