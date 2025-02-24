
import { Handle, Position } from '@xyflow/react';
import { NodeOutput } from '@/types/flow';
import { baseHandleStyle } from '../node-utils/nodeStyles';

interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
  isStop?: boolean;
  settings?: Record<string, any>;
  isStartScript?: boolean;
  type?: string;
}

export const NodeOutputs = ({ isGeneratePerson, outputs, isStop, settings, isStartScript, type }: NodeOutputsProps) => {
  const getSettingHandles = () => {
    if (!settings) return { inputs: [], outputs: [] };
    
    if (settings.useSettingsPort && settings.inputs && settings.outputs) {
      return {
        inputs: settings.inputs,
        outputs: settings.outputs
      };
    }
    
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
    
    return { inputs: handledSettings, outputs: [] };
  };

  const { inputs, outputs: settingOutputs } = getSettingHandles();

  const validateConnection = (connection: any) => {
    console.log('Validating connection:', connection);
    
    if (isStartScript) {
      console.log('Connection rejected: start script node');
      return false;
    }

    if (connection.targetHandle?.startsWith('input-')) {
      console.log('Connection to input handle:', connection.targetHandle);
      return true;
    }

    console.log('Connection allowed');
    return true;
  };

  // Check if the node is read-table type
  const isReadTable = type === 'read-table';
  const shouldShowInput = !isGeneratePerson && !settings?.useSettingsPort && !isStartScript && !isReadTable;

  return (
    <div className="relative w-full mt-4">
      {/* Input handles */}
      {inputs.length > 0 && (
        <div className="flex flex-col gap-6 mb-6">
          {inputs.map((input) => (
            <div key={input.id} className="relative flex items-center min-h-[28px] pl-4">
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                style={{
                  ...baseHandleStyle,
                  position: 'absolute',
                  left: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                isValidConnection={validateConnection}
              />
              <span className="text-xs text-gray-600 block">{input.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Default input/output handles */}
      <div className="relative flex items-center justify-between min-h-[28px]">
        {shouldShowInput && (
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
            isValidConnection={validateConnection}
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

      {/* Generate person outputs */}
      {(isGeneratePerson ? outputs : settingOutputs)?.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          {(isGeneratePerson ? outputs : settingOutputs).map((output) => (
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
