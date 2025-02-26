
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

  // Создаем массив настроек для клавиатурных нод
  const getKeyboardSettings = () => {
    if (!isKeyboardNode || !type) return [];

    switch (type) {
      case 'keyboard-type':
        return [
          { id: 'text', label: 'Text' },
          { id: 'delay', label: 'Delay' }
        ];
      case 'keyboard-press':
        return [{ id: 'key', label: 'Key' }];
      case 'keyboard-down':
        return [
          { id: 'key', label: 'Key' },
          { id: 'duration', label: 'Duration' }
        ];
      case 'keyboard-shortcut':
        return [{ id: 'shortcut', label: 'Shortcut' }];
      case 'keyboard-focus-type':
        return [
          { id: 'selector', label: 'Selector' },
          { id: 'text', label: 'Text' },
          { id: 'delay', label: 'Delay' }
        ];
      default:
        return [];
    }
  };

  const keyboardSettings = getKeyboardSettings();

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

  // Для Mouse и Keyboard нод добавляем входные точки для настроек и точки потока
  if (isMouseNode || isKeyboardNode) {
    return (
      <div className="mt-4">
        <div>
          {/* Отображаем точки для настроек клавиатуры */}
          {isKeyboardNode && keyboardSettings.map((setting) => (
            <div key={setting.id} className="relative flex items-center justify-between h-8">
              <Handle
                type="target"
                position={Position.Left}
                id={setting.id}
                className="w-2 h-1 !bg-primary"
                style={{ left: -8 }}
              />
              <span className="text-xs text-muted-foreground ml-4">{setting.label}</span>
            </div>
          ))}
          {/* Отображаем точки для mouse inputs */}
          {mouseInputs && mouseInputs.map((input) => (
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
