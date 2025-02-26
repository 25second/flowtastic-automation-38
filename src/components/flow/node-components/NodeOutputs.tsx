
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
  type?: string;
}

export const NodeOutputs: React.FC<NodeOutputsProps> = ({
  isGeneratePerson,
  outputs,
  isStop,
  settings,
  isStartScript,
  mathInputs,
  mathOutputs,
  type
}) => {
  // Определяем outputs для read-table
  const tableOutputs = type === 'read-table' ? [{ id: 'data', label: 'Data' }] : undefined;

  // Определяем outputs для ai-action
  const aiOutputs = type === 'ai-action' ? [{ id: 'result', label: 'Result' }] : undefined;

  const finalOutputs = outputs || tableOutputs || aiOutputs;

  if (isGeneratePerson || (finalOutputs && (type === 'read-table' || type === 'ai-action'))) {
    return (
      <div className="mt-4 space-y-2">
        {finalOutputs?.map((output, index) => (
          <div key={output.id} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              className="w-2 h-1 !bg-primary"
              style={{ 
                right: -8,
                top: 'auto',
                bottom: 'auto',
                transform: 'translateY(50%)'
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
        {mathInputs?.map((input) => (
          <div key={input.id} className="flex items-center justify-between mb-2">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              className="w-2 h-1 !bg-primary"
              style={{ left: -8 }}
            />
            <span className="text-xs text-muted-foreground">{input.label}</span>
          </div>
        ))}
        {mathOutputs?.map((output) => (
          <div key={output.id} className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              className="w-2 h-1 !bg-primary"
              style={{ right: -8 }}
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
        className="w-2 h-1 !bg-primary"
        style={{ left: -8 }}
      />
    );
  }

  if (isStartScript) {
    return (
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-1 !bg-primary"
        style={{ right: -8 }}
      />
    );
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-1 !bg-primary"
        style={{ left: -8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-1 !bg-primary"
        style={{ right: -8 }}
      />
    </>
  );
};
