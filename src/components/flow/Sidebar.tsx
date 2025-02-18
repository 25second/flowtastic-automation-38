
import { Search, Settings, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { nodeCategories } from './nodeConfig';
import { useState } from 'react';
import type { NodeCategory, FlowNode } from '@/types/flow';
import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useReactFlow } from '@xyflow/react';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setNodes } = useReactFlow();

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  const handleDelete = (nodeType: string) => {
    setNodes((nodes) => nodes.filter(node => node.type !== nodeType));
    toast.success('Node deleted from canvas');
  };

  const handleSettings = (nodeType: string) => {
    // This will be handled by your existing settings dialog
    toast.info('Opening settings for ' + nodeType);
  };

  return (
    <div className="w-[360px] border-r bg-background">
      <div className="pt-16 p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-9rem)]">
        {filteredCategories.map((category) => (
          <div key={category.name} className="p-4">
            <h2 className="mb-2 text-sm font-semibold">{category.name}</h2>
            <div className="grid grid-cols-2 gap-2">
              {category.nodes.map((node) => {
                if (!node.icon) return null;
                const IconComponent: LucideIcon = node.icon;
                return (
                  <div
                    key={node.type}
                    className={cn(
                      "rounded-md border bg-card p-2 cursor-move hover:border-primary relative group",
                      "transition-colors duration-200"
                    )}
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type, node.label, node.settings, node.description)}
                    style={{ borderLeft: `4px solid ${node.color || '#9b87f5'}` }}
                  >
                    <div className="absolute -top-2 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSettings(node.type);
                              }}
                              className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 border"
                            >
                              <Settings className="h-3 w-3 text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Node settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(node.type);
                              }}
                              className="p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border"
                            >
                              <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete node</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[currentColor]" style={{ color: node.color }}>
                        <IconComponent size={16} />
                      </div>
                      <div className="text-sm font-medium truncate">{node.label}</div>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {node.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
