import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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
  const { deleteElements } = useReactFlow();
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

  return (
    <div 
      style={{
        borderLeft: `4px solid ${data.color || '#9b87f5'}`,
        backgroundColor: selected ? `${data.color}15` : 'white',
      }}
      className="group mx-0 px-[10px] py-2 relative nodrag rounded-md border border-gray-200 shadow-sm hover:shadow-md"
    >
      <button
        onClick={handleDelete}
        className="absolute -right-2 -top-2 p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border hidden group-hover:block nodrag"
        title="Delete node"
      >
        <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
      </button>

      <Handle 
        type="target" 
        position={Position.Left}
        style={{ 
          width: '8px',
          height: '4px',
          borderRadius: '2px',
          border: 'none',
          backgroundColor: data.color || '#9b87f5'
        }}
      />
      <div className="flex items-center gap-2 w-full">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">
          {data.description}
        </div>
      )}
      <Handle 
        type="source" 
        position={Position.Right}
        style={{ 
          width: '8px',
          height: '4px',
          borderRadius: '2px',
          border: 'none',
          backgroundColor: data.color || '#9b87f5'
        }}
      />
      
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
