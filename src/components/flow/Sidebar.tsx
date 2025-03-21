
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { nodeCategories } from '@/data/nodes';
import { useState } from 'react';
import type { NodeCategory, FlowNode } from '@/types/flow';
import { DynamicIcon } from './node-components/DynamicIcon';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="w-[360px] border-r bg-background">
      <div className="pt-16 p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('flow.searchNodes')}
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
                return (
                  <div
                    key={node.type}
                    className={cn(
                      "rounded-md border bg-card p-2 cursor-move hover:border-primary",
                      "transition-colors duration-200"
                    )}
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type, node.label, node.settings, node.description)}
                    style={{ borderLeft: `4px solid ${node.color || '#9b87f5'}` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[currentColor]" style={{ color: node.color }}>
                        <DynamicIcon icon={node.icon} className="h-4 w-4" />
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
