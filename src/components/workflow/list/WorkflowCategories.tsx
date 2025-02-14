
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface WorkflowCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onAddCategory: (category: string) => void;
}

export const WorkflowCategories = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: WorkflowCategoriesProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [editedName, setEditedName] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (categories.includes(newCategory.trim())) {
        toast.error('Такая категория уже существует');
        return;
      }
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setShowAddDialog(false);
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditedName(category);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== editingCategory) {
      if (categories.includes(editedName.trim())) {
        toast.error('Такая категория уже существует');
        return;
      }
      const newCategories = categories.map(cat => 
        cat === editingCategory ? editedName.trim() : cat
      );
      // Обновляем выбранную категорию если она была изменена
      if (selectedCategory === editingCategory) {
        onSelectCategory(editedName.trim());
      }
      onAddCategory(editedName.trim());
      categories.splice(categories.indexOf(editingCategory), 1);
      setShowEditDialog(false);
      toast.success('Категория переименована');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (selectedCategory === category) {
      onSelectCategory(null);
    }
    categories.splice(categories.indexOf(category), 1);
    toast.success('Категория удалена');
  };

  return (
    <>
      <div className="relative mb-4">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-2 p-1">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="rounded-full"
              onClick={() => onSelectCategory(null)}
            >
              Все
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="rounded-full"
                onClick={() => onSelectCategory(category)}
                onDoubleClick={() => handleEditCategory(category)}
              >
                {category}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить категорию</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Новое название категории"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEdit();
                }
              }}
            />
            <Button onClick={handleSaveEdit} className="w-full">
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
