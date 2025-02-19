
import { useState } from 'react';
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
  const { deleteElements, setNodes } = useReactFlow();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});

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

  const isStartNode = data.type === 'start';

  return (
    <>
      <div 
        className={`group relative w-[200px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md ${
          isStartNode ? 'animate-pulse' : ''
        }`}
        style={isStartNode ? {
          background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 1) 70%)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        } : undefined}
      >
        <div className="absolute -right-2 -top-2 flex gap-2 invisible group-hover:visible z-50">
          {!isStartNode && (
            <button
              onClick={handleSettingsClick}
              className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 border nodrag"
              title="Node settings"
            >
              <Settings2 className="h-3 w-3 text-gray-600" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border nodrag"
            title="Delete node"
          >
            <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
          </button>
        </div>

        <div className="px-4 py-3">
          {!isStartNode && (
            <Handle 
              type="target" 
              position={Position.Left}
              style={{ 
                width: '8px',
                height: '4px',
                borderRadius: '2px',
                border: 'none',
                backgroundColor: '#9b87f5'
              }}
              isValidConnection={() => true}
            />
          )}
          
          <div className="flex flex-col items-start gap-1 w-full nodrag">
            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{data.label}</span>
              {data.icon && <data.icon className="h-4 w-4 text-gray-500" />}
            </div>
            {data.description && (
              <div className="text-xs text-gray-500 line-clamp-2">
                {data.description}
              </div>
            )}
          </div>
          
          <Handle 
            type="source" 
            position={Position.Right}
            style={{ 
              width: '8px',
              height: '4px',
              borderRadius: '2px',
              border: 'none',
              backgroundColor: '#9b87f5'
            }}
            isValidConnection={() => true}
          />
        </div>
      </div>
      
      {!isStartNode && (
        <SettingsDialog
          open={showSettings}
          onOpenChange={setShowSettings}
          settings={data.settings || {}}
          localSettings={localSettings}
          onSettingChange={handleSettingChange}
          label={data.label}
        />
      )}
    </>
  );
};

// Add Browser Control node types
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
  'close-tab': CustomNode
};

export { CustomNode, nodeTypes };
