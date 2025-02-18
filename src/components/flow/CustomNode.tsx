
import { useState } from 'react';
import { Settings, Trash } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
}

export const CustomNode = ({ data, id }: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
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

  return (
    <div style={{
      borderLeft: `4px solid ${data.color || '#9b87f5'}`
    }} className="mx-0 px-[10px]">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2 w-full">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
        <button onClick={e => {
          e.stopPropagation();
          setShowSettings(true);
          setLocalSettings(data.settings || {});
        }} className="p-1 rounded-full hover:bg-gray-100">
          <Settings className="h-4 w-4" />
        </button>
        <button onClick={handleDelete} className="p-1 rounded-full hover:bg-gray-100 hover:text-red-600">
          <Trash className="h-4 w-4" />
        </button>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">
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
  'api-delete': CustomNode,
  'note': CustomNode,
  'group': CustomNode,
} as const;
