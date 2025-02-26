
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

  // Проверяем, является ли нода из категории Mouse или Keyboard
  const isMouseNode = type?.startsWith('mouse-');
  const isKeyboardNode = type?.startsWith('keyboard-');
  const mouseInputs = isMouseNode && settings?.inputs;
  const keyboardInputs = isKeyboardNode && settings?.inputs;

  if (isGeneratePerson || (finalOutputs && (type === 'read-table' || type === 'ai-action'))) {
    return (
      <div className="mt-4">
        {finalOutputs?.map((output, index) => (
          <div key={output.id} className="relative flex items-center justify-between h-8">
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

  if (mathInputs || mathOutputs) {
    return (
      <div className="mt-4">
        <div>
          {mathInputs?.map((input) => (
            <div key={input.id} className="relative flex items-center justify-between h-8">
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                className="w-2 h-1 !bg-primary"
                style={{ left: -8 }}
              />
              <span className="text-xs text-muted-foreground ml-4">{input.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2">
          {mathOutputs?.map((output) => (
            <div key={output.id} className="relative flex items-center justify-between h-8">
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
      </div>
    );
  }

  // Для Mouse и Keyboard нод добавляем входные и выходные точки потока
  if ((isMouseNode && mouseInputs) || (isKeyboardNode && keyboardInputs)) {
    const inputs = mouseInputs || keyboardInputs;
    return (
      <div className="mt-4">
        <div>
          {inputs.map((input) => (
            <div key={input.id} className="relative flex items-center justify-between h-8">
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                className="w-2 h-1 !bg-primary"
                style={{ left: -8 }}
              />
              <span className="text-xs text-muted-foreground ml-4">{input.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 relative h-8 flex items-center justify-between px-4">
          <div className="flex items-center">
            <Handle
              type="target"
              position={Position.Left}
              className="w-2 h-1 !bg-primary"
              style={{ left: -8 }}
              id="flow"
            />
            <span className="text-xs text-muted-foreground ml-2">In</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Out</span>
            <Handle
              type="source"
              position={Position.Right}
              className="w-2 h-1 !bg-primary"
              style={{ right: -8 }}
              id="flow"
            />
          </div>
        </div>
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
