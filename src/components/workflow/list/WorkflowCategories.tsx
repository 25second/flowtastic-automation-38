
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [showManageDialog, setShowManageDialog] = useState(false);
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

  const handleEditCategory = async (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      if (categories.includes(newName.trim())) {
        toast.error('Такая категория уже существует');
        return;
      }

      try {
        const { error } = await supabase
          .from('workflow_categories')
          .update({ name: newName.trim() })
          .eq('name', oldName);

        if (error) throw error;

        // Обновляем выбранную категорию если она была изменена
        if (selectedCategory === oldName) {
          onSelectCategory(newName.trim());
        }

        setShowEditDialog(false);
        toast.success('Категория переименована');

        // Обновляем workflows с новым именем категории
        const { error: workflowError } = await supabase
          .from('workflows')
          .update({ category: newName.trim() })
          .eq('category', oldName);

        if (workflowError) {
          console.error('Error updating workflows category:', workflowError);
        }

      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Ошибка при обновлении категории');
      }
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const { error } = await supabase
        .from('workflow_categories')
        .delete()
        .eq('name', categoryName);

      if (error) throw error;

      if (selectedCategory === categoryName) {
        onSelectCategory(null);
      }

      // Обновляем workflows, убирая удаленную категорию
      const { error: workflowError } = await supabase
        .from('workflows')
        .update({ category: null })
        .eq('category', categoryName);

      if (workflowError) {
        console.error('Error updating workflows category:', workflowError);
      }

      toast.success('Категория удалена');
      setShowManageDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Ошибка при удалении категории');
    }
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
              >
                {category}
              </Button>
            ))}
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowManageDialog(true)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
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

      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Управление категориями</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <span>{category}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setEditedName(category);
                      setShowEditDialog(true);
                      setShowManageDialog(false);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
                  handleEditCategory(editingCategory, editedName);
                }
              }}
            />
            <Button 
              onClick={() => handleEditCategory(editingCategory, editedName)} 
              className="w-full"
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
