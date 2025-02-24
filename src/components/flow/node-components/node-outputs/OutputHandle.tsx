
import { Handle, Position } from '@xyflow/react';

interface OutputHandleProps {
  id?: string;
  label?: string;
  style: React.CSSProperties;
}

export const OutputHandle = ({ id, label, style }: OutputHandleProps) => (
  <div className="relative flex items-center justify-between min-h-[28px]">
    {label && <span className="text-xs text-gray-600 pr-6">{label}</span>}
    <Handle
      type="source"
      position={Position.Right}
      id={id}
      style={{
        ...style,
        position: 'absolute',
        right: '-11px',
        top: '50%',
        transform: 'translateY(-50%)'
      }}
      isValidConnection={() => true}
    />
  </div>
);
