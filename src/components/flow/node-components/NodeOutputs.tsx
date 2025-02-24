
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

export const NodeOutputs = ({ isGeneratePerson, outputs = [], isStop, settings, isStartScript, type }: NodeOutputsProps) => {
  const handles = (() => {
    if (!settings) return { inputs: [], outputs: [] };
    
    const inputs: { id: string; label: string }[] = [];
    
    // Handle standard settings
    const settingsMap = {
      selector: 'Selector',
      text: 'Text',
      url: 'URL',
      x: 'X',
      y: 'Y',
      endX: 'End X',
      endY: 'End Y',
      deltaX: 'Delta X',
      deltaY: 'Delta Y'
    };

    Object.entries(settingsMap).forEach(([key, label]) => {
      if (key in settings || (key === 'x' && 'startX' in settings) || (key === 'y' && 'startY' in settings)) {
        inputs.push({ id: key, label });
      }
    });

    // Handle settings.inputs if it exists and is an array
    if (settings.useSettingsPort && Array.isArray(settings.inputs)) {
      return {
        inputs: settings.inputs.map(input => ({
          id: String(input?.id || ''),
          label: String(input?.label || '')
        })),
        outputs: Array.isArray(settings.outputs) 
          ? settings.outputs.map(output => ({
              id: String(output?.id || ''),
              label: String(output?.label || '')
            }))
          : []
      };
    }

    return { inputs, outputs: [] };
  })();

  const isReadTable = type === 'read-table';
  const shouldShowInput = !isGeneratePerson && !settings?.useSettingsPort && !isStartScript && !isReadTable;

  // Format outputs for generate person node
  const nodeOutputs = isGeneratePerson
    ? outputs.map(output => ({
        id: String(output?.id || ''),
        label: String(output?.label || '')
      }))
    : handles.outputs;

  return (
    <div className="relative w-full mt-4">
      {/* Input Handles */}
      {handles.inputs.length > 0 && (
        <div className="flex flex-col gap-6 mb-6">
          {handles.inputs.map(({ id, label }) => (
            <div key={id} className="relative flex items-center min-h-[28px] pl-4">
              <Handle
                type="target"
                position={Position.Left}
                id={id}
                style={{
                  ...baseHandleStyle,
                  position: 'absolute',
                  left: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <span className="text-xs text-gray-600 block">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Input/Output */}
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
          />
        )}
      </div>

      {/* Output Handles */}
      {nodeOutputs.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          {nodeOutputs.map(({ id, label }) => (
            <div key={id} className="relative flex items-center justify-between min-h-[28px]">
              <span className="text-xs text-gray-600 pr-6">{label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={id}
                style={{
                  ...baseHandleStyle,
                  position: 'absolute',
                  right: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
