
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NodeData } from '@/types/workflow';

export const CustomNode = memo(({ data, id }: NodeProps<NodeData>) => {
  const nodeData = data as NodeData;
  
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{nodeData.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {nodeData.description && (
          <p className="text-sm text-muted-foreground">{nodeData.description}</p>
        )}
        <Handle type="target" position={Position.Left} id={`${id}-target`} />
        <Handle type="source" position={Position.Right} id={`${id}-source`} />
      </CardContent>
    </Card>
  );
});

CustomNode.displayName = "CustomNode";
