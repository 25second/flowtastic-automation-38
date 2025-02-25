
import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeControls } from './node-components/NodeControls';
import { cn } from '@/lib/utils';
import { NodeOutputs } from './node-components/NodeOutputs';
import { NodeData } from '@/types/flow';

export const CustomNode = memo(({ id, type, data, selected }: NodeProps<NodeData>) => {
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
});

// Define nodeTypes with proper typing
export const nodeTypes = {
  default: CustomNode,
  'ai-action': CustomNode,
  'generate-person': CustomNode,
  'start-script': CustomNode,
  'stop': CustomNode,
  'new-tab': CustomNode,
  'switch-tab': CustomNode,
  'wait-for-tab': CustomNode,
  'close-tab': CustomNode,
  'mouse-click': CustomNode,
  'mouse-click-modified': CustomNode,
  'mouse-double-click': CustomNode,
  'mouse-hover': CustomNode,
  'mouse-move': CustomNode,
  'mouse-drag-drop': CustomNode,
  'mouse-wheel': CustomNode,
  'keyboard-type': CustomNode,
  'keyboard-press': CustomNode,
  'keyboard-down': CustomNode,
  'keyboard-shortcut': CustomNode,
  'keyboard-focus-type': CustomNode,
  'read-table': CustomNode,
  'write-table': CustomNode,
  'wait-timeout': CustomNode,
  'wait-element': CustomNode,
  'wait-element-hidden': CustomNode,
  'wait-function': CustomNode,
  'wait-navigation': CustomNode,
  'wait-load': CustomNode,
  'wait-network-idle': CustomNode,
  'wait-dom-loaded': CustomNode,
  'math-add': CustomNode,
  'math-subtract': CustomNode,
  'math-multiply': CustomNode,
  'math-divide': CustomNode,
  'math-random': CustomNode,
  'linken-sphere-stop-session': CustomNode
} as const;
