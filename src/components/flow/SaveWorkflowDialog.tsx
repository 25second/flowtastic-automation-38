
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/workflow";
import { Edge, Node } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface SaveWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  onSave: ({ id, nodes, edges }: { id?: string; nodes: Node[]; edges: Edge[] }) => void;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  categories: Category[];
  editingWorkflow?: any;
}

export function SaveWorkflowDialog({
  open,
  onOpenChange,
  nodes,
  edges,
  onSave,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
  categories,
  editingWorkflow,
}: SaveWorkflowDialogProps) {
  const { t } = useLanguage();
  
  const handleSave = () => {
    onSave({
      id: editingWorkflow?.id,
      nodes,
      edges,
    });
    onOpenChange(false);
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const newTag = event.currentTarget.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      event.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingWorkflow ? t('workflow.edit') : t('workflow.save')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('workflow.form.name')}</Label>
            <Input
              id="name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder={t('workflow.form.namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('workflow.form.description')}</Label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder={t('workflow.form.descriptionPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t('workflow.form.category')}</Label>
            <Select
              value={category?.id || ''}
              onValueChange={(value) => {
                const selectedCategory = categories.find(c => c.id === value);
                setCategory(selectedCategory || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('workflow.form.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">{t('workflow.form.tags')}</Label>
            <Input
              id="tags"
              placeholder={t('workflow.form.tagsPlaceholder')}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            {editingWorkflow ? t('workflow.update') : t('workflow.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
