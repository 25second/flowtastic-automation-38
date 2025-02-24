
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
  data: { label: string };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 rounded-md border bg-white">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
