
import { Handle, Position } from '@xyflow/react';
import { NodeOutput } from '@/types/flow';
import { baseHandleStyle } from '../node-utils/nodeStyles';

interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
  isStop?: boolean;
  settings?: Record<string, any>;
}

export const NodeOutputs = ({ isGeneratePerson, outputs, isStop, settings }: NodeOutputsProps) => {
  const getSettingHandles = () => {
    if (!settings) return [];
    
    const handledSettings = [];
    
    // Определяем настройки, для которых нужны входные точки
    if ('selector' in settings) {
      handledSettings.push({
        id: 'selector',
        label: 'Selector'
      });
    }
    if ('text' in settings) {
      handledSettings.push({
        id: 'text',
        label: 'Text'
      });
    }
    if ('url' in settings) {
      handledSettings.push({
        id: 'url',
        label: 'URL'
      });
    }
    if ('x' in settings || 'startX' in settings) {
      handledSettings.push({
        id: 'x',
        label: 'X'
      });
    }
    if ('y' in settings || 'startY' in settings) {
      handledSettings.push({
        id: 'y',
        label: 'Y'
      });
    }
    if ('endX' in settings) {
      handledSettings.push({
        id: 'endX',
        label: 'End X'
      });
    }
    if ('endY' in settings) {
      handledSettings.push({
        id: 'endY',
        label: 'End Y'
      });
    }
    if ('deltaX' in settings) {
      handledSettings.push({
        id: 'deltaX',
        label: 'Delta X'
      });
    }
    if ('deltaY' in settings) {
      handledSettings.push({
        id: 'deltaY',
        label: 'Delta Y'
      });
    }
    
    return handledSettings;
  };

  const settingHandles = getSettingHandles();

  return (
    <div className="relative w-full">
      {/* Входные точки для настроек */}
      {settingHandles.length > 0 && (
        <div className="absolute -left-3 top-4 flex flex-col gap-6">
          {settingHandles.map((setting, index) => (
            <div key={setting.id} className="flex items-center gap-2 relative h-6">
              <Handle
                type="target"
                position={Position.Left}
                id={`setting-${setting.id}`}
                style={{
                  ...baseHandleStyle,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                isValidConnection={() => true}
              />
              <span className="text-xs text-gray-500 absolute left-4 whitespace-nowrap">
                {setting.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Основной контент ноды */}
      <div className={`mt-${settingHandles.length > 0 ? (settingHandles.length * 6 + 2) : 0}`}>
        {/* Основные выходы для generate-person */}
        {isGeneratePerson && outputs ? (
          <div className="space-y-4">
            {outputs.map((output, index) => (
              <div key={output.id} className="relative flex items-center justify-between py-1">
                <span className="text-xs text-gray-600 pr-6">{output.label}</span>
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
        ) : !isStop ? (
          <div className="relative h-6">
            <Handle
              type="source"
              position={Position.Right}
              style={baseHandleStyle}
              isValidConnection={() => true}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
