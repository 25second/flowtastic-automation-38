
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
  // Определяем outputs для всех типов нод
  const getNodeOutputs = () => {
    if (type === 'read-table') return [{ id: 'data', label: 'Data' }];
    if (type === 'ai-action') return [{ id: 'result', label: 'Result' }];
    if (isGeneratePerson) return outputs;
    return undefined;
  };

  // Определяем settings inputs для всех типов нод
  const getNodeSettings = () => {
    if (!type || !settings) return [];

    if (type.startsWith('keyboard-')) {
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
      }
    }

    // Для таймер нод
    if (type.startsWith('wait-')) {
      const settings = [{ id: 'timeout', label: 'Timeout' }];
      if (type === 'wait-element' || type === 'wait-element-hidden') {
        settings.unshift({ id: 'selector', label: 'Selector' });
      }
      return settings;
    }

    // Для нод работы с таблицами
    if (type === 'read-table' || type === 'write-table') {
      return [
        { id: 'tableName', label: 'Table Name' },
        { id: 'columnName', label: 'Column' }
      ];
    }

    // Для нод браузера
    if (type === 'navigate') {
      return [{ id: 'url', label: 'URL' }];
    }

    // Для нод взаимодействия
    if (type === 'click' || type === 'input-text') {
      const settings = [{ id: 'selector', label: 'Selector' }];
      if (type === 'input-text') {
        settings.push({ id: 'text', label: 'Text' });
      }
      return settings;
    }

    // Для AI нод
    if (type === 'ai-action') {
      return [
        { id: 'action', label: 'Action' },
        { id: 'description', label: 'Description' }
      ];
    }

    return [];
  };

  const nodeOutputs = getNodeOutputs();
  const settingsInputs = getNodeSettings();
  const hasFlowPoints = !isStartScript && !isStop; // Нужны ли точки In/Out

  return (
    <div className="mt-4">
      {/* Settings inputs */}
      {settingsInputs.length > 0 && (
        <div className="mb-4">
          {settingsInputs.map((setting) => (
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
        </div>
      )}

      {/* Math inputs/outputs */}
      {(mathInputs || mathOutputs) && (
        <>
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
        </>
      )}

      {/* Node outputs */}
      {nodeOutputs && (
        <div className="mb-4">
          {nodeOutputs.map((output) => (
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
      )}

      {/* Flow points (In/Out) */}
      {hasFlowPoints && (
        <div className="relative h-8 flex items-center justify-between px-4">
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
      )}

      {/* Special cases for start/stop nodes */}
      {isStartScript && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-2 h-1 !bg-primary"
          style={{ right: -8 }}
        />
      )}
      {isStop && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-1 !bg-primary"
          style={{ left: -8 }}
        />
      )}
    </div>
  );
};
