
import { Handle, Position } from '@xyflow/react';
import { NodeOutput, NodeSettings } from '@/types/flow';
import { FlowHandles } from './node-parts/FlowHandles';
import { MathHandles } from './node-parts/MathHandles';
import { SettingsInputs } from './node-parts/SettingsInputs';

export interface NodeOutputsProps {
  isGeneratePerson: boolean;
  outputs?: NodeOutput[];
  isStop: boolean;
  settings?: NodeSettings;
  isStartScript: boolean;
  mathInputs?: Array<{ id: string; label: string }>;
  mathOutputs?: Array<{ id: string; label: string }>;
  type?: string;
  showFlowPoints?: boolean;
}

export const NodeOutputs = ({
  isGeneratePerson,
  outputs,
  isStop,
  settings,
  isStartScript,
  mathInputs,
  mathOutputs,
  type,
  showFlowPoints
}: NodeOutputsProps) => {
  const showSettingsPort = settings?.useSettingsPort;
  const settingsInputs = settings?.inputs || [];

  if (isStartScript) {
    return (
      <div className="mt-2">
        <Handle
          type="source"
          position={Position.Right}
          id="flow"
          className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
          style={{ right: -8 }}
        />
      </div>
    );
  }

  if (isStop) {
    return (
      <div className="mt-2">
        <Handle
          type="target"
          position={Position.Left}
          id="flow"
          className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
          style={{ left: -8 }}
        />
      </div>
    );
  }

  return (
    <div className="mt-2">
      {isGeneratePerson && outputs && (
        <div className="flex flex-col space-y-4">
          {outputs.filter(output => 
            !settings?.selectedOutputs || 
            settings.selectedOutputs.includes(output.id)
          ).map((output, index) => (
            <div key={output.id} className="relative" style={{ height: "24px" }}>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
                style={{ 
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <span className="absolute right-6 text-xs text-gray-600">
                {output.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {mathInputs && (
        <MathHandles inputs={mathInputs} outputs={mathOutputs} />
      )}

      {showSettingsPort && settingsInputs.length > 0 && (
        <SettingsInputs settings={settingsInputs} />
      )}

      {showFlowPoints && (
        <div className="relative h-8 flex items-center justify-between px-4">
          <div className="flex items-center">
            <Handle
              type="target"
              position={Position.Left}
              id="flow"
              className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
              style={{ left: -8 }}
            />
          </div>
          <div className="flex items-center">
            <Handle
              type="source"
              position={Position.Right}
              id="flow"
              className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary hover:!bg-primary hover:!shadow-[0_0_12px_rgba(155,135,245,0.4)]"
              style={{ right: -8 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
