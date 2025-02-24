
import { NodeOutput } from '@/types/flow';
import { InputHandle } from './node-outputs/InputHandle';
import { OutputHandle } from './node-outputs/OutputHandle';
import { useHandleStyle } from './node-outputs/useHandleStyle';
import { getSettingHandles, validateConnection } from './node-outputs/handleUtils';

interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
  isStop?: boolean;
  settings?: Record<string, any>;
  isStartScript?: boolean;
  type?: string;
}

export const NodeOutputs = ({ 
  isGeneratePerson, 
  outputs, 
  isStop, 
  settings, 
  isStartScript, 
  type 
}: NodeOutputsProps) => {
  const handleStyle = useHandleStyle();
  const { inputs, outputs: settingOutputs } = getSettingHandles(settings);
  
  const isReadTable = type === 'read-table';
  const shouldShowInput = !isGeneratePerson && !settings?.useSettingsPort && !isStartScript && !isReadTable;

  return (
    <div className="relative w-full mt-4">
      {/* Input handles */}
      {inputs.length > 0 && (
        <div className="flex flex-col gap-6 mb-6">
          {inputs.map((input) => (
            <InputHandle
              key={input.id}
              id={input.id}
              label={input.label}
              style={handleStyle}
              validateConnection={validateConnection}
            />
          ))}
        </div>
      )}

      {/* Default input/output handles */}
      <div className="relative flex items-center justify-between min-h-[28px]">
        {shouldShowInput && (
          <InputHandle
            id="main"
            style={handleStyle}
            validateConnection={validateConnection}
          />
        )}
        
        {!isStop && (
          <OutputHandle
            style={handleStyle}
          />
        )}
      </div>

      {/* Generate person outputs */}
      {(isGeneratePerson ? outputs : settingOutputs)?.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          {(isGeneratePerson ? outputs : settingOutputs).map((output) => (
            <OutputHandle
              key={output.id}
              id={output.id}
              label={output.label}
              style={handleStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
