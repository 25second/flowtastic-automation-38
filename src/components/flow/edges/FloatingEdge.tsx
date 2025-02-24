
import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export const FloatingEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
  );
};
