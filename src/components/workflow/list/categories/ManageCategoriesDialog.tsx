
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onDeleteCategory: (category: string) => void;
  onStartEditCategory: (category: string) => void;
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
            <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span>{category}</span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStartEditCategory(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeleteCategory(category)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
