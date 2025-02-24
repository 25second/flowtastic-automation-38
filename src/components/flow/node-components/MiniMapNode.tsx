
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface MiniMapNodeProps {
  data: { label: string };
}

export const MiniMapNode: React.FC<MiniMapNodeProps> = ({ data }) => {
  return (
    <div className="px-2 py-1 rounded-sm border bg-white text-xs">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
