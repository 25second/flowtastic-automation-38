
import { cn } from "@/lib/utils";
import { nodeCategories } from './nodeConfig';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NodeCategory, FlowNode } from '@/types/flow';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  return (
    <div className="w-[360px] border-r bg-background">
      <ScrollArea className="h-[calc(100vh-1rem)]"> {/* Adjusted height since we removed the search input */}
        {nodeCategories.map((category) => (
          <div key={category.name} className="p-4">
            <h2 className="mb-2 text-sm font-semibold">{category.name}</h2>
            <div className="grid grid-cols-2 gap-2">
              {category.nodes.map((node) => (
                <div
                  key={node.type}
                  className={cn(
                    "rounded-md border bg-card p-2 cursor-move hover:border-primary",
                    "transition-colors duration-200"
                  )}
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type, node.label, node.settings, node.description)}
                >
                  <div className="text-sm font-medium truncate">{node.label}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{node.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
