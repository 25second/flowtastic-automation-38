
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

interface PortConfig {
  id: string;
  label: string;
}

export const NodeOutputs = ({ isGeneratePerson, outputs, isStop, settings, isStartScript, type }: NodeOutputsProps) => {
  const getSettingHandles = () => {
    if (!settings) return { inputs: [], outputs: [] };
    
    if (settings.useSettingsPort && Array.isArray(settings.inputs) && Array.isArray(settings.outputs)) {
      const formatPort = (port: any): PortConfig => {
        const id = port?.id ?? '';
        const label = port?.label ?? '';
        return {
          id: String(id),
          label: String(label)
        };
      };

      return {
        inputs: settings.inputs.map(formatPort),
        outputs: settings.outputs.map(formatPort)
      };
    }
    
    const handledSettings: PortConfig[] = [];
    
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
    if (isStartScript) {
      return false;
    }

    if (connection.targetHandle?.startsWith('input-')) {
      return true;
    }

    return true;
  };

  const isReadTable = type === 'read-table';
  const shouldShowInput = !isGeneratePerson && !settings?.useSettingsPort && !isStartScript && !isReadTable;

  const formatOutput = (output: any): PortConfig => {
    if (!output) return { id: 'default', label: '' };
    const id = output?.id ?? 'default';
    const label = output?.label ?? '';
    return {
      id: String(id),
      label: String(label)
    };
  };

  const formattedOutputs = ((isGeneratePerson ? outputs : settingOutputs) || [])
    .map(formatOutput)
    .filter(output => output.id !== undefined);

  return (
    <div className="relative w-full mt-4">
      {Array.isArray(inputs) && inputs.length > 0 && (
        <div className="flex flex-col gap-6 mb-6">
          {inputs.map((input) => {
            const safeInput = formatOutput(input);
            return (
              <div key={safeInput.id} className="relative flex items-center min-h-[28px] pl-4">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={safeInput.id}
                  style={{
                    ...baseHandleStyle,
                    position: 'absolute',
                    left: '-11px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  isValidConnection={validateConnection}
                />
                <span className="text-xs text-gray-600 block">{safeInput.label}</span>
              </div>
            );
          })}
        </div>
      )}

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
            id="default"
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

      {Array.isArray(formattedOutputs) && formattedOutputs.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          {formattedOutputs.map((output) => (
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
