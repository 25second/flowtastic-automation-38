
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { SettingsInputs } from './node-parts/SettingsInputs';
import { MathHandles } from './node-parts/MathHandles';
import { FlowHandles } from './node-parts/FlowHandles';
import { getNodeSettings, getNodeOutputs } from '../node-utils/nodeSettingsUtils';

interface NodeOutputsProps {
  isGeneratePerson?: boolean;
  outputs?: { id: string; label: string }[];
  isStop?: boolean;
  settings?: Record<string, any>;
  isStartScript?: boolean;
  mathInputs?: { id: string; label: string }[];
  mathOutputs?: { id: string; label: string }[];
  type?: string;
  showFlowPoints?: boolean;
}

export const NodeOutputs: React.FC<NodeOutputsProps> = ({
  isGeneratePerson,
  outputs,
  isStop,
  settings,
  isStartScript,
  mathInputs,
  mathOutputs,
  type,
  showFlowPoints
}) => {
  const settingsInputs = getNodeSettings(type, settings);
  const nodeOutputs = getNodeOutputs(type, outputs, isGeneratePerson);
  const isWriteTable = type === 'write-table';
  
  // Use basic logic for all nodes except generate-person
  const shouldShowFlowPoints = isGeneratePerson ? false : (
    !isStartScript && !isStop && 
    type !== 'read-table' && type !== 'write-table'
  );

  return (
    <div className="mt-4">
      {isWriteTable && (
        <div className="mb-4">
          <div className="relative flex items-center justify-between h-8">
            <Handle
              type="target"
              position={Position.Left}
              id="data"
              className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary !z-10"
              style={{ left: -8 }}
            />
            <span className="text-xs text-muted-foreground ml-4">Data</span>
          </div>
        </div>
      )}
      
      <SettingsInputs settings={settingsInputs} />
      
      <MathHandles inputs={mathInputs} outputs={mathOutputs} />

      {nodeOutputs && (
        <div className="mb-4">
          {nodeOutputs.map((output) => (
            <div key={output.id} className="relative flex items-center justify-between h-8">
              <span className="text-xs text-muted-foreground">{output.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                className="!w-3 !h-3 !rounded-full !bg-white !border-2 !border-primary !z-10"
                style={{ right: -8 }}
              />
            </div>
          ))}
        </div>
      )}

      <FlowHandles
        isStartScript={isStartScript}
        isStop={isStop}
        showFlowPoints={shouldShowFlowPoints}
      />
    </div>
  );
};
