
import { Handle, Position } from '@xyflow/react';

interface InputHandleProps {
  id: string;
  label?: string;
  style: React.CSSProperties;
  validateConnection: (connection: any) => boolean;
}

export const InputHandle = ({ id, label, style, validateConnection }: InputHandleProps) => (
  <div className="relative flex items-center min-h-[28px] pl-4">
    <Handle
      type="target"
      position={Position.Left}
      id={id}
      style={{
        ...style,
        position: 'absolute',
        left: '-11px',
        top: '50%',
        transform: 'translateY(-50%)'
      }}
      isValidConnection={validateConnection}
    />
    {label && <span className="text-xs text-gray-600 block">{label}</span>}
  </div>
);
