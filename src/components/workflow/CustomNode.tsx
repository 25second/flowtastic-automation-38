
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CustomNodeData {
  label: string;
  description?: string;
}

export const CustomNode = memo(({ data, id }: NodeProps<CustomNodeData>) => {
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description}</p>
        )}
        <Handle type="target" position={Position.Left} id={`${id}-target`} />
        <Handle type="source" position={Position.Right} id={`${id}-source`} />
      </CardContent>
    </Card>
  );
});

CustomNode.displayName = "CustomNode";
