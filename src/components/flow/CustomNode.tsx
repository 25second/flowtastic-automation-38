
import React, { memo } from 'react';
import { Handle, Position, NodeResizer, NodeProps, NodeTypes } from '@xyflow/react';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeControls } from './node-components/NodeControls';
import { cn } from '@/lib/utils';
import { NodeOutputs } from './node-components/NodeOutputs';
import { NodeData, CustomNodeProps } from '@/types/flow';

const CustomNodeComponent = ({ id, type, data, selected }: CustomNodeProps) => {
  const isGeneratePerson = type === 'generate-person';
  const isStop = type === 'stop';
  const isStartScript = type === 'start-script';
  const isMathNode = type.startsWith('math-');

  // Math node specific settings
  const mathInputs = isMathNode && data.settings?.inputs ? data.settings.inputs : [];
  const mathOutputs = isMathNode && data.settings?.outputs ? data.settings.outputs : [];

  return (
    <div
      className={cn(
        'relative flex min-h-[60px] w-[200px] flex-col rounded-lg border bg-background p-3 shadow-sm',
        selected && 'border-primary'
      )}
      style={{ borderLeft: `4px solid ${data.color || '#9b87f5'}` }}
    >
      <NodeResizer minWidth={200} minHeight={60} isVisible={!!selected} />

      {/* Add input handle for most nodes */}
      {!isStartScript && !isMathNode && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-white !border-2 border-primary"
          style={{ left: -8 }}
        />
      )}

      {/* Add output handle for most nodes */}
      {!isStop && !isMathNode && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-white !border-2 border-primary"
          style={{ right: -8 }}
        />
      )}

      {/* Render math node inputs */}
      {isMathNode && mathInputs.map((input: any, index: number) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="!w-3 !h-3 !bg-white !border-2 border-primary"
          style={{ left: -8, top: `${25 + (index * 30)}%` }}
        />
      ))}

      {/* Render math node outputs */}
      {isMathNode && mathOutputs.map((output: any, index: number) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!w-3 !h-3 !bg-white !border-2 border-primary"
          style={{ right: -8, top: `${25 + (index * 30)}%` }}
        />
      ))}

      <NodeHeader 
        label={data.label}
        description={data.description || ''}
        icon={data.icon}
      />
      
      <NodeControls 
        selected={!!selected}
        onDelete={(e) => console.log('delete', e)}
      />

      <NodeOutputs
        isGeneratePerson={isGeneratePerson}
        outputs={data.outputs || []}
        isStop={isStop}
        settings={data.settings}
        isStartScript={isStartScript}
        mathInputs={mathInputs}
        mathOutputs={mathOutputs}
      />
    </div>
  );
};

export const CustomNode = memo(CustomNodeComponent);

const customNode = CustomNode as unknown as React.FC<NodeProps>;

export const nodeTypes: NodeTypes = {
  default: customNode,
  'ai-action': customNode,
  'generate-person': customNode,
  'start-script': customNode,
  'stop': customNode,
  'new-tab': customNode,
  'switch-tab': customNode,
  'wait-for-tab': customNode,
  'close-tab': customNode,
  'mouse-click': customNode,
  'mouse-click-modified': customNode,
  'mouse-double-click': customNode,
  'mouse-hover': customNode,
  'mouse-move': customNode,
  'mouse-drag-drop': customNode,
  'mouse-wheel': customNode,
  'keyboard-type': customNode,
  'keyboard-press': customNode,
  'keyboard-down': customNode,
  'keyboard-shortcut': customNode,
  'keyboard-focus-type': customNode,
  'read-table': customNode,
  'write-table': customNode,
  'wait-timeout': customNode,
  'wait-element': customNode,
  'wait-element-hidden': customNode,
  'wait-function': customNode,
  'wait-navigation': customNode,
  'wait-load': customNode,
  'wait-network-idle': customNode,
  'wait-dom-loaded': customNode,
  'math-add': customNode,
  'math-subtract': customNode,
  'math-multiply': customNode,
  'math-divide': customNode,
  'math-random': customNode,
  'linken-sphere-stop-session': customNode
};
