
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface MathHandlesProps {
  inputs?: { id: string; label: string }[];
  outputs?: { id: string; label: string }[];
}

export const MathHandles: React.FC<MathHandlesProps> = ({ inputs, outputs }) => {
  const handleClass = "!w-3 !h-1.5 !rounded-full !bg-background hover:!bg-primary !border-[1px] !border-primary transition-all duration-300 hover:!w-4 hover:!shadow-[0_0_10px_rgba(155,135,245,0.5)]";

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
              className={handleClass}
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
              className={handleClass}
              style={{ right: -8 }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
