
import { Node } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface NodeData {
  label: string;
  description?: string;
}

interface NodeDetailsSidebarProps {
  node: Node<NodeData> | null;
  onClose: () => void;
  onUpdate: (data: Partial<NodeData>) => void;
}

export const NodeDetailsSidebar = ({ node, onClose, onUpdate }: NodeDetailsSidebarProps) => {
  if (!node) return null;

  return (
    <div className="w-80 border-l bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Node Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={node.data.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={node.data.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Position X</Label>
            <Input
              type="number"
              value={node.position.x}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Position Y</Label>
            <Input
              type="number"
              value={node.position.y}
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Input
            value={node.type}
            disabled
          />
        </div>
      </div>
    </div>
  );
};
