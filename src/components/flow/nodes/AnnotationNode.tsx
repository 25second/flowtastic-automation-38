
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { Textarea } from "@/components/ui/textarea";

interface AnnotationNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

export const AnnotationNode = ({ data, id, selected }: AnnotationNodeProps) => {
  const { deleteElements, setNodes } = useReactFlow();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(data.settings || {});
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({
      nodes: [{ id }]
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
        return {
          ...node,
          data: {
            ...currentData,
            settings: {
              ...(currentData.settings || {}),
              [key]: value
            }
          }
        };
      }
      return node;
    }));
  };

  return (
    <div 
      className="node-annotation group relative min-w-[160px] max-w-[300px] text-[#683bfa] bg-transparent border-0 rounded-none shadow-none font-mono text-base"
      onClick={() => setIsEditing(true)}
    >
      <div className={`
        absolute -right-2 -top-2 flex gap-2 z-50
        ${selected ? 'visible' : 'invisible group-hover:visible'}
      `}>
        <button
          onClick={handleDelete}
          className="nodrag p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border py-[4px] px-[4px]"
          title="Delete annotation"
        >
          <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
        </button>
      </div>
      
      <div className="p-2.5 relative">
        <div>
          {isEditing ? (
            <Textarea
              value={localSettings.text || ''}
              onChange={(e) => handleSettingChange('text', e.target.value)}
              onBlur={() => setIsEditing(false)}
              placeholder="Add your annotation here..."
              className="min-h-[60px] bg-transparent border-none focus:ring-0 nodrag resize-none text-[#683bfa] text-base font-mono"
              autoFocus
            />
          ) : (
            <div className="text-base text-[#683bfa] font-mono whitespace-pre-wrap cursor-text">
              {localSettings.text || 'Click to add annotation...'}
            </div>
          )}
        </div>
        {localSettings.showArrow && (
          <div 
            className="absolute right-0 bottom-0 text-2xl text-[#683bfa]"
            style={{ transform: 'translate(-10px, 10px) rotate(-80deg)' }}
          >
            ⤹
          </div>
        )}
      </div>
    </div>
  );
};
