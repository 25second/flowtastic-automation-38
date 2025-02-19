import { useState, useEffect } from 'react';
import { Trash2, Settings2 } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}
const CustomNode = ({
  data,
  id,
  selected
}: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    deleteElements,
    setNodes
  } = useReactFlow();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});
  useEffect(() => {
    console.log('Node rendering:', {
      id,
      type: data.type,
      isDataProcessing: typeof data.type === 'string' && data.type.startsWith('data-'),
      selected,
      data
    });
  }, [id, data, selected]);
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({
      nodes: [{
        id
      }]
    });
    toast.success('Node deleted');
  };
  const handleSettingChange = (key: string, value: any) => {
    console.log('Setting change:', {
      key,
      value,
      nodeId: id
    });
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setNodes(nds => nds.map(node => {
      if (node.id === id) {
        const currentData = node.data as FlowNodeData;
        const nodeData: FlowNodeData = {
          ...currentData,
          settings: {
            ...(currentData.settings || {}),
            [key]: value
          }
        };
        return {
          ...node,
          data: nodeData
        };
      }
      return node;
    }));
  };
  const handleSettingsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSettings(true);
  };
  const isPageInteraction = typeof data.type === 'string' && data.type.startsWith('page-');
  const isStartNode = data.type === 'start';
  const isClickNode = data.type === 'page-click';
  const isDataProcessing = typeof data.type === 'string' && data.type.startsWith('data-');
  console.log('Node classification:', {
    id,
    type: data.type,
    isDataProcessing,
    isPageInteraction,
    isStartNode,
    isClickNode
  });
  const nodeClassNames = ['group', 'relative', 'w-[200px]', 'bg-white', 'rounded-lg', 'border', 'border-gray-200', selected ? 'shadow-lg ring-2 ring-orange-200' : 'shadow-sm hover:shadow-md', 'transition-shadow', 'duration-200'].join(' ');
  return <>
      <div className={nodeClassNames} style={isDataProcessing || isClickNode ? {
      borderLeft: '4px solid #F97316'
    } : isPageInteraction ? {
      borderLeft: '4px solid #F97316'
    } : isStartNode ? {
      borderLeft: '4px solid #22C55E'
    } : undefined}>
        <div className={`
            absolute -right-2 -top-2 flex gap-2 z-50
            ${selected ? 'visible' : 'invisible group-hover:visible'}
          `}>
          <button onClick={handleSettingsClick} title="Node settings" className="p-1 bg-white shadow-sm hover:bg-gray-100 border nodrag px-[8px] rounded-full py-[8px]">
            <Settings2 className="h-3 w-3 text-gray-600" />
          </button>
          <button onClick={handleDelete} title="Delete node" className="p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border nodrag py-[4px] px-[4px]">
            <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
          </button>
        </div>

        <div className={`px-4 py-3 ${isDataProcessing || isClickNode ? 'bg-orange-50' : ''}`}>
          <Handle type="target" position={Position.Left} style={{
          width: '8px',
          height: '4px',
          borderRadius: '2px',
          border: 'none',
          backgroundColor: '#9b87f5'
        }} isValidConnection={() => true} />
          
          <div className="flex flex-col items-start gap-1 w-full nodrag">
            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{data.label}</span>
              {data.icon && <data.icon className={`h-4 w-4 ${isPageInteraction || isDataProcessing ? 'text-orange-500' : 'text-gray-500'}`} />}
            </div>
            {data.description && <div className="text-xs text-gray-500 line-clamp-2">
                {data.description}
              </div>}
          </div>
          
          <Handle type="source" position={Position.Right} style={{
          width: '8px',
          height: '4px',
          borderRadius: '2px',
          border: 'none',
          backgroundColor: '#9b87f5'
        }} isValidConnection={() => true} />
        </div>
      </div>
      
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} settings={data.settings || {}} localSettings={localSettings} onSettingChange={handleSettingChange} label={data.label} />
    </>;
};
const nodeTypes = {
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
  // Additional node types from nodes.json
  'click': CustomNode,
  'save-data': CustomNode,
  'read-data': CustomNode,
  'wait': CustomNode,
  'condition': CustomNode,
  'read-excel': CustomNode,
  'write-excel': CustomNode,
  'http-request': CustomNode,
  'run-script': CustomNode,
  'session-stop': CustomNode
};
export { CustomNode, nodeTypes };