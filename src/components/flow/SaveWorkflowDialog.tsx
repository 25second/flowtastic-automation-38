
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Category } from "@/types/workflow";

interface SaveWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
  workflowDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  category: Category | null;
  onCategoryChange: (category: Category) => void;
  categories: Category[];
}

export const SaveWorkflowDialog = ({
  open,
  onOpenChange,
  workflowName,
  workflowDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  tags,
  onTagsChange,
  category,
  onCategoryChange,
  categories,
}: SaveWorkflowDialogProps) => {
  const [tagInput, setTagInput] = useState("");
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!session?.user) {
      toast.error("Please sign in to save workflows");
      return;
    }

    if (!workflowName.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }

    setIsLoading(true);
    try {
      await onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Workflow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={workflowName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Enter workflow description"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category?.id} 
              onValueChange={(value) => {
                const selectedCategory = categories.find(c => c.id === value);
                if (selectedCategory) {
                  onCategoryChange(selectedCategory);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Workflow"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
