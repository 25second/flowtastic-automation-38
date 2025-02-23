
import { Handle, Position } from '@xyflow/react';
import { NodeOutput } from '@/types/flow';
import { baseHandleStyle } from '../node-utils/nodeStyles';

interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
  isStop?: boolean;
  settings?: Record<string, any>;
  isStartScript?: boolean;
}

export const NodeOutputs = ({ isGeneratePerson, outputs, isStop, settings, isStartScript }: NodeOutputsProps) => {
  const getSettingHandles = () => {
    if (!settings) return [];
    
    const handledSettings = [];
    
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

  const validateSettingConnection = (connection: any) => {
    // Запрещаем подключение к настройкам только если это начальный узел
    if (isStartScript) return false;
    // Разрешаем подключение к настройкам, если targetHandle соответствует настройке
    return connection.targetHandle?.startsWith('setting-');
  };

  const validateMainConnection = (connection: any) => {
    // Запрещаем подключение к основному входу для начального узла
    if (isStartScript) return false;
    // Разрешаем подключение к основному входу
    return true;
  };

  return (
    <div className="relative w-full mt-4">
      {/* Входные точки для настроек */}
      {settingHandles.length > 0 && (
        <div className="flex flex-col gap-6 mb-6">
          {settingHandles.map((setting, index) => (
            <div key={setting.id} className="relative flex items-center min-h-[28px] pl-4">
              <Handle
                type="target"
                position={Position.Left}
                id={`setting-${setting.id}`}
                style={{
                  ...baseHandleStyle,
                  position: 'absolute',
                  left: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                isValidConnection={validateSettingConnection}
              />
              <span className="text-xs text-gray-600 block">{setting.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Основные точки входа/выхода */}
      <div className="relative flex items-center justify-between min-h-[28px]">
        {!isStartScript && (
          <Handle
            type="target"
            position={Position.Left}
            id="main"
            style={{
              ...baseHandleStyle,
              position: 'absolute',
              left: '-11px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            isValidConnection={validateMainConnection}
          />
        )}
        
        {!isStop && (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              ...baseHandleStyle,
              position: 'absolute',
              right: '-11px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            isValidConnection={() => true}
          />
        )}
      </div>

      {/* Дополнительные выходы для generate-person */}
      {isGeneratePerson && outputs && (
        <div className="flex flex-col gap-6 mt-6">
          {outputs.map((output) => (
            <div key={output.id} className="relative flex items-center justify-between min-h-[28px]">
              <span className="text-xs text-gray-600 pr-6">{output.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                style={{
                  ...baseHandleStyle,
                  position: 'absolute',
                  right: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                isValidConnection={() => true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
