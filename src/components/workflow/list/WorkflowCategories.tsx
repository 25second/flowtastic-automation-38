
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CategoryList } from "./categories/CategoryList";
import { AddCategoryDialog } from "./categories/AddCategoryDialog";
import { EditCategoryDialog } from "./categories/EditCategoryDialog";
import { ManageCategoriesDialog } from "./categories/ManageCategoriesDialog";

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
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [editedName, setEditedName] = useState("");

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

        if (selectedCategory === oldName) {
          onSelectCategory(newName.trim());
        }

        setShowEditDialog(false);
        toast.success('Категория переименована');

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

  const handleStartEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditedName(category);
    setShowEditDialog(true);
    setShowManageDialog(false);
  };

  return (
    <>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onShowAddDialog={() => setShowAddDialog(true)}
        onShowManageDialog={() => setShowManageDialog(true)}
      />

      <AddCategoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddCategory={onAddCategory}
        categories={categories}
      />

      <EditCategoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editingCategory={editingCategory}
        editedName={editedName}
        setEditedName={setEditedName}
        onEditCategory={handleEditCategory}
      />

      <ManageCategoriesDialog
        open={showManageDialog}
        onOpenChange={setShowManageDialog}
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
        onStartEditCategory={handleStartEditCategory}
      />
    </>
  );
};
