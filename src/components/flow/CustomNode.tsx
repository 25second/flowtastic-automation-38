
import { useState } from 'react';
import { Settings, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    // Update the node data in the flow
    setNodes(nds => 
      nds.map(node => {
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

  const renderSettingInput = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={key}
            checked={localSettings[key] || false}
            onCheckedChange={(checked) => handleSettingChange(key, checked)}
          />
          <Label htmlFor={key} className="capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </Label>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          <Label htmlFor={key} className="capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </Label>
          <Select
            value={Array.isArray(localSettings[key]) ? localSettings[key].join(',') : ''}
            onValueChange={(val) => handleSettingChange(key, val.split(','))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select options" />
            </SelectTrigger>
            <SelectContent>
              {value.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <div className="pl-4 space-y-2">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey}>
                {renderSettingInput(`${key}.${subKey}`, subValue)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (key === 'time') {
      return (
        <div className="space-y-2">
          <Label htmlFor={key} className="capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </Label>
          <Input
            type="time"
            id={key}
            value={localSettings[key] || value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={key} className="capitalize">
          {key.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Input
          type={typeof value === 'number' ? 'number' : 'text'}
          id={key}
          value={localSettings[key] || value}
          onChange={(e) => handleSettingChange(key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
        />
      </div>
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
              <div key={key}>
                {renderSettingInput(key, value)}
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
  'api-get': CustomNode,
  'api-post': CustomNode,
  'api-put': CustomNode,
  'api-delete': CustomNode,
};
