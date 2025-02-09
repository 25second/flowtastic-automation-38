
import { useState } from 'react';
import { Settings, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';

interface CustomNodeProps {
  data: {
    label: string;
    description?: string;
    settings?: Record<string, any>;
  };
  id: string;
}

export const CustomNode = ({ data, id }: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow();
  const [localSettings, setLocalSettings] = useState(data.settings || {});

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    // Update the node data in the flow
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              settings: {
                ...node.data.settings,
                [key]: value
              }
            }
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2 w-full">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
            setLocalSettings(data.settings || {});
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-gray-100 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.label} Settings</DialogTitle>
            <DialogDescription>Configure the parameters for this node</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(data.settings || {}).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <Input 
                  value={localSettings[key] || ''} 
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
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
};
