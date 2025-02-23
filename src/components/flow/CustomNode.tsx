import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
import { NodeControls } from './node-components/NodeControls';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeOutputs } from './node-components/NodeOutputs';
import { baseHandleStyle, getNodeBorderStyle } from './node-utils/nodeStyles';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

const CustomNode = ({ data, id, selected }: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingChange = useCallback((nodeId: string, settings: Record<string, any>) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, settings }
        };
      }
      return node;
    }));
  }, [setNodes]);

  const handleSettingsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSettings(true);
  };

  const isPageInteraction = typeof data.type === 'string' && data.type.startsWith('page-');
  const isStartNode = data.type === 'start';
  const isClickNode = data.type === 'page-click';
  const isDataProcessing = typeof data.type === 'string' && data.type.startsWith('data-');
  const isGeneratePerson = data.type === 'generate-person';

  const nodeClassNames = [
    'group',
    'relative',
    'w-[200px]',
    'bg-white',
    'rounded-lg',
    'border',
    'border-gray-200',
    selected ? 'shadow-lg ring-2 ring-orange-200' : 'shadow-sm hover:shadow-md',
    'transition-shadow',
    'duration-200'
  ].join(' ');

  const style = {
    ...getNodeBorderStyle(isDataProcessing, isClickNode, isPageInteraction, isStartNode),
    ...(isGeneratePerson && data.outputs ? { minHeight: `${data.outputs.length * 40 + 100}px` } : {})
  };

  return (
    <>
      <div 
        className={nodeClassNames} 
        style={style}
      >
        <NodeControls
          selected={selected}
          onSettingsClick={handleSettingsClick}
          onDelete={handleDelete}
        />

        <div className={`px-4 py-3 ${isDataProcessing || isClickNode ? 'bg-orange-50' : ''}`}>
          <Handle
            type="target"
            position={Position.Left}
            style={baseHandleStyle}
            isValidConnection={() => true}
          />
          
          <NodeHeader
            label={data.label}
            icon={data.icon}
            description={data.description}
            isPageInteraction={isPageInteraction}
            isDataProcessing={isDataProcessing}
          />
          
          <NodeOutputs
            isGeneratePerson={isGeneratePerson}
            outputs={data.outputs}
          />
        </div>
      </div>
      
      <SettingsDialog 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        nodeId={id}
        nodeData={data}
        onSettingsChange={handleSettingChange}
        initialSettings={data.settings}
      />
    </>
  );
};

export { CustomNode };

export const nodeTypes = {
  'default': CustomNode,
  'input': CustomNode,
  'output': CustomNode,
  'trigger-schedule': CustomNode,
  'trigger-event': CustomNode,
  'tab-new': CustomNode,
  'tab-close': CustomNode,
  'tab-switch': CustomNode,
  'page-click': CustomNode,
  'page-type': CustomNode,
  'page-scroll': CustomNode,
  'js-execute': CustomNode,
  'js-evaluate': CustomNode,
  'screenshot-full': CustomNode,
  'screenshot-element': CustomNode,
  'data-extract': CustomNode,
  'data-save': CustomNode,
  'flow-if': CustomNode,
  'flow-loop': CustomNode,
  'flow-wait': CustomNode,
  'api-get': CustomNode,
  'api-post': CustomNode,
  'api-put': CustomNode,
  'api-delete': CustomNode,
  'start': CustomNode,
  'end': CustomNode,
  'open-page': CustomNode,
  'navigate': CustomNode,
  'close-tab': CustomNode,
  'extract': CustomNode,
  'click': CustomNode,
  'save-data': CustomNode,
  'read-data': CustomNode,
  'wait': CustomNode,
  'condition': CustomNode,
  'read-excel': CustomNode,
  'write-excel': CustomNode,
  'http-request': CustomNode,
  'run-script': CustomNode,
  'session-stop': CustomNode,
  'generate-person': CustomNode
};
