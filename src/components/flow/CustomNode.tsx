
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Handle, Position } from '@xyflow/react';

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

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2 w-full">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
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
                  value={value as string} 
                  onChange={(e) => {
                    data.settings[key] = e.target.value;
                  }}
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
  'browser-goto': CustomNode,
  'browser-click': CustomNode,
  'browser-input': CustomNode,
  'data-extract': CustomNode,
  'data-save': CustomNode,
  'flow-if': CustomNode,
  'flow-loop': CustomNode,
  'input': CustomNode,
};
