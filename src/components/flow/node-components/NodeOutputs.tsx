
import { Handle, Position } from '@xyflow/react';
import { NodeData, NodeOutput, NodeSettings } from '@/types/flow';

interface NodeOutputsProps {
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
  if (isStop) {
    return <Handle type="target" position={Position.Left} />;
  }

  if (isStartScript) {
    return <Handle type="source" position={Position.Right} />;
  }

  if (mathInputs || mathOutputs) {
    return (
      <div className="w-full">
        {mathInputs && (
          <div className="flex flex-col gap-3 mb-4">
            {mathInputs.map((input) => (
              <div key={input.id} className="flex items-center justify-between">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={input.id}
                  style={{ left: -8 }}
                />
                <span className="text-xs text-muted-foreground">{input.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {mathOutputs && (
          <div className="flex flex-col gap-3">
            {mathOutputs.map((output) => (
              <div key={output.id} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{output.label}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={output.id}
                  style={{ right: -8 }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const showInputHandle = showFlowPoints || (type?.startsWith('mouse-') || type?.startsWith('keyboard-'));

  return (
    <div className="w-full">
      {showInputHandle && (
        <Handle type="target" position={Position.Left} style={{ left: -8 }} />
      )}

      {outputs && (
        <div className="flex flex-col gap-3 mt-2">
          {outputs.map((output) => (
            <div key={output.id} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{output.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                style={{ right: -8 }}
              />
            </div>
          ))}
        </div>
      )}

      {!outputs && showFlowPoints && (
        <Handle type="source" position={Position.Right} style={{ right: -8 }} />
      )}
    </div>
  );
};

