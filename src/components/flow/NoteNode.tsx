
import { memo } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';

interface NoteNodeData {
  label?: string;
  description?: string;
  color?: string;
  settings?: Record<string, any>;
}

const NoteNode = ({ data, id }: NodeProps<NoteNodeData>) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div 
        className="p-4 bg-yellow-50 rounded-md shadow-sm min-w-[200px] min-h-[100px] border border-yellow-200"
        style={{ borderLeft: `4px solid ${data.color || '#FBC02D'}` }}
      >
        <div className="text-sm font-medium mb-2">{data.label || 'Note'}</div>
        <div className="text-xs text-muted-foreground whitespace-pre-wrap">
          {data.description || 'Add your note here'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(NoteNode);
