
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { Category } from "@/types/workflow";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onDeleteCategory?: (categoryId: string) => void;
  onStartEditCategory?: (category: Category) => void;
}

export const ManageCategoriesDialog = ({
  open,
  onOpenChange,
  categories,
  onDeleteCategory,
  onStartEditCategory,
}: ManageCategoriesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление категориями</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span>{category.name}</span>
              <div className="flex space-x-2">
                {onStartEditCategory && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStartEditCategory(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDeleteCategory && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDeleteCategory(category.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Нет категорий
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
