
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeOutputsProps {
  isGeneratePerson?: boolean;
  outputs?: { id: string; label: string }[];
  isStop?: boolean;
  settings?: Record<string, any>;
  isStartScript?: boolean;
  mathInputs?: { id: string; label: string }[];
  mathOutputs?: { id: string; label: string }[];
}

export const NodeOutputs: React.FC<NodeOutputsProps> = ({
  isGeneratePerson,
  outputs,
  isStop,
  settings,
  isStartScript,
  mathInputs,
  mathOutputs
}) => {
  const handleStyle = {
    width: '8px',
    height: '4px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: '1px'
  };

  if (isGeneratePerson && outputs) {
    return (
      <div className="mt-4 space-y-2">
        {outputs.map((output, index) => (
          <div key={output.id} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ 
                ...handleStyle,
                right: -8,
                top: `${50 + (index * 28)}%`,
                transform: 'translateY(-50%)'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (mathInputs || mathOutputs) {
    return (
      <div className="mt-4">
        {mathInputs?.map((input, index) => (
          <div key={input.id} className="flex items-center justify-between mb-2">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ 
                ...handleStyle,
                left: -8,
                top: `${50 + (index * 28)}%`,
                transform: 'translateY(-50%)'
              }}
            />
            <span className="text-xs text-muted-foreground">{input.label}</span>
          </div>
        ))}
        {mathOutputs?.map((output, index) => (
          <div key={output.id} className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ 
                ...handleStyle,
                right: -8,
                top: `${50 + (index * 28)}%`,
                transform: 'translateY(-50%)'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (isStop) {
    return (
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          ...handleStyle,
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    );
  }

  if (isStartScript) {
    return (
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          ...handleStyle,
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    );
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          ...handleStyle,
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          ...handleStyle,
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </>
  );
};
