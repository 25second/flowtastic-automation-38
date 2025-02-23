
import { Handle, Position } from '@xyflow/react';
import { NodeOutput } from '@/types/flow';
import { baseHandleStyle } from '../node-utils/nodeStyles';

interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
}

export const NodeOutputs = ({ isGeneratePerson, outputs }: NodeOutputsProps) => {
  if (isGeneratePerson && outputs) {
    return (
      <div className="mt-4 space-y-2">
        {outputs.map((output, index) => (
          <div key={output.id} className="relative flex items-center justify-between py-1">
            <span className="text-xs text-gray-600">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{
                ...baseHandleStyle,
                position: 'absolute',
                right: '-29px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              isValidConnection={() => true}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Handle
      type="source"
      position={Position.Right}
      style={baseHandleStyle}
      isValidConnection={() => true}
    />
  );
};
