
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: string) => void;
  categories: string[];
}

export const AddCategoryDialog = ({
  open,
  onOpenChange,
  onAddCategory,
  categories
}: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (categories.includes(newCategory.trim())) {
        toast.error('Такая категория уже существует');
        return;
      }
      onAddCategory(newCategory.trim());
      setNewCategory("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить категорию</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Название категории"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCategory();
              }
            }}
          />
          <Button onClick={handleAddCategory} className="w-full">
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
