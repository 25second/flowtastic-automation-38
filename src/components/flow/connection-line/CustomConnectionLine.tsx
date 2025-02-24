
import React from 'react';
import { ConnectionLineComponentProps, getSmoothStepPath } from '@xyflow/react';

export const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}) => {
  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#9b87f5"
        strokeWidth={2}
        className="animated"
        d={path}
      />
    </g>
  );
};
