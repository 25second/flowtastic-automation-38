
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

  return (
    <div className="mt-2">
      {isStartScript && settings?.outputs?.map((output) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!bg-blue-500"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
      ))}

      {isGeneratePerson && outputs?.map((output) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!bg-purple-500"
          style={{ top: '20%', transform: 'translateY(-50%)' }}
        />
      ))}

      {mathInputs && (
        <MathHandles inputs={mathInputs} outputs={mathOutputs} />
      )}

      {showSettingsPort && (
        <SettingsInputs settings={settingsInputs} />
      )}

      <FlowHandles 
        isStartScript={isStartScript}
        isStop={isStop}
        showFlowPoints={showFlowPoints}
        nodeType={type}
      />
    </div>
  );
};
