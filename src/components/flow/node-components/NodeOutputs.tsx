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
  // Render math node inputs
  const renderMathInputs = () => {
    return mathInputs?.map((input, index) => (
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
    ));
  };

  // Render math node outputs
  const renderMathOutputs = () => {
    return mathOutputs?.map((output, index) => (
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
    ));
  };

  // Render person generator outputs
  if (isGeneratePerson && outputs) {
    return (
      <div className="mt-4 space-y-2">
        {outputs.map((output) => (
          <div key={output.id} className="flex items-center justify-between">
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

  // Render math node inputs and outputs
  if (mathInputs || mathOutputs) {
    return (
      <div className="mt-4">
        {renderMathInputs()}
        {renderMathOutputs()}
      </div>
    );
  }

  // Render default handle for stop nodes
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

  // Render default handles for start script
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

  // Default case: render both input and output handles
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
