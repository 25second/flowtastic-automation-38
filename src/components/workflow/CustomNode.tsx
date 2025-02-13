
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CustomNodeData {
  label: string;
  content?: React.ReactNode;
}

export const CustomNode = memo(({ data }: NodeProps<CustomNodeData>) => {
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {data.content}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </CardContent>
    </Card>
  );
});

CustomNode.displayName = "CustomNode";
