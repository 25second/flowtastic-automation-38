
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { AddCategoryDialog } from "@/components/workflow/list/categories/AddCategoryDialog";
import { ManageCategoriesDialog } from "@/components/workflow/list/categories/ManageCategoriesDialog";
import { Category } from "@/types/workflow";

interface TaskCategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (category: Category) => void;
  isLoading?: boolean;
}

export const TaskCategories = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  isLoading = false,
}: TaskCategoriesProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);

  if (isLoading) {
    return <div className="h-10 bg-muted/30 animate-pulse rounded-md"></div>;
  }

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
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
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

      {/* Dialogs */}
      {showAddDialog && (
        <AddCategoryDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddCategory={onAddCategory}
          categories={categories}
        />
      )}
      {showManageDialog && (
        <ManageCategoriesDialog
          open={showManageDialog}
          onOpenChange={setShowManageDialog}
          categories={categories}
          onDeleteCategory={onDeleteCategory}
          onStartEditCategory={onEditCategory}
        />
      )}
    </>
  );
};
