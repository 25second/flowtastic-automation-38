
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

  return (
    <div
      className={cn(
        'relative flex min-h-[60px] w-[200px] flex-col rounded-lg border bg-background p-3 shadow-sm group',
        selected && 'border-primary'
      )}
      style={{ borderLeft: `4px solid ${data.color || '#9b87f5'}` }}
    >
      <NodeResizer minWidth={200} minHeight={60} isVisible={!!selected} />

      {/* Basic input handle for non-start nodes */}
      {!isStartScript && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'var(--handle-color, #fff)', border: '2px solid var(--handle-border-color, #9b87f5)' }}
        />
      )}

      {/* Generate Person node outputs */}
      {isGeneratePerson && data.outputs && (
        <div className="absolute right-0 top-0 h-full">
          {data.outputs.map((output, index) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              style={{
                background: 'var(--handle-color, #fff)',
                border: '2px solid var(--handle-border-color, #9b87f5)',
                top: `${(index + 1) * (100 / (data.outputs?.length || 1))}%`,
                transform: 'translateY(-50%)'
              }}
            />
          ))}
        </div>
      )}

      {/* Basic output handle for non-stop and non-generate-person nodes */}
      {!isStop && !isGeneratePerson && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'var(--handle-color, #fff)', border: '2px solid var(--handle-border-color, #9b87f5)' }}
        />
      )}

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
