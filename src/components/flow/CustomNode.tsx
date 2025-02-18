
import { useState } from 'react';
import { Copy, Settings, Trash } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

export const CustomNode = ({
  data,
  id,
  selected
}: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    deleteElements,
    setNodes,
    getNode,
    addNodes
  } = useReactFlow();

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

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    const node = getNode(id);
    if (node) {
      const newNode = {
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50
        }
      };
      addNodes(newNode);
      toast.success('Node copied');
    }
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

  return (
    <div 
      style={{
        borderLeft: `4px solid ${data.color || '#9b87f5'}`
      }}
      className="mx-0 px-[10px] relative nodrag"
    >
      <div className="absolute -top-8 left-0 right-0 flex justify-end gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm z-10">
        <button
          onClick={handleCopy}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600 transition-colors nodrag"
          title="Copy node"
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            setShowSettings(true);
            setLocalSettings(data.settings || {});
          }}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600 transition-colors nodrag"
          title="Settings"
        >
          <Settings className="h-3 w-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors nodrag"
          title="Delete node"
        >
          <Trash className="h-3 w-3" />
        </button>
      </div>

      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2 w-full py-1">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1 mb-1">
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
      
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={data.settings || {}}
        localSettings={localSettings}
        onSettingChange={handleSettingChange}
        label={data.label}
      />
    </div>
  );
};

export const nodeTypes = {
  'input': CustomNode,
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
  'api-delete': CustomNode
};
