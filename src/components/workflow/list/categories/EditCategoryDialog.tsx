
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: string;
  editedName: string;
  setEditedName: (name: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
}

export const EditCategoryDialog = ({
  open,
  onOpenChange,
  editingCategory,
  editedName,
  setEditedName,
  onEditCategory,
}: EditCategoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onEditCategory(editingCategory, editedName);
              }
            }}
          />
          <Button 
            onClick={() => onEditCategory(editingCategory, editedName)} 
            className="w-full"
          >
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
