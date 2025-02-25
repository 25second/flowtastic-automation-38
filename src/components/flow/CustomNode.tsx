
import React, { memo } from 'react';
import { Handle, Position, NodeResizer, NodeProps } from '@xyflow/react';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeControls } from './node-components/NodeControls';
import { cn } from '@/lib/utils';
import { NodeOutputs } from './node-components/NodeOutputs';
import { NodeData, CustomNodeProps } from '@/types/flow';

const CustomNodeComponent = ({ id, type, data, selected }: CustomNodeProps) => {
  const isGeneratePerson = type === 'generate-person';
  const isStop = type === 'stop';
  const isStartScript = type === 'start-script';

  const nodeData = data as NodeData;

  return (
    <div
      className={cn(
        'relative flex min-h-[60px] w-[200px] flex-col rounded-lg border bg-background p-3 shadow-sm',
        selected && 'border-primary'
      )}
    >
      <NodeResizer minWidth={200} minHeight={60} isVisible={!!selected} />
      <NodeHeader 
        label={nodeData.label}
        description={nodeData.description || ''}
        icon={nodeData.icon}
      />
      <NodeControls 
        selected={!!selected}
        onDelete={(e) => console.log('delete', e)}
      />
      <NodeOutputs
        isGeneratePerson={isGeneratePerson}
        outputs={nodeData.outputs || []}
        isStop={isStop}
        settings={nodeData.settings}
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
