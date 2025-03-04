
import { Button } from "@/components/ui/button";
import { Category } from "@/types/workflow";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AgentCategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onEditCategory: (category: Category) => Promise<void>;
  isLoading: boolean;
}

export function AgentCategories({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  isLoading
}: AgentCategoriesProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = async () => {
    if (editingCategory && editedCategoryName.trim()) {
      await onEditCategory({
        ...editingCategory,
        name: editedCategoryName.trim()
      });
      setEditingCategory(null);
      setEditedCategoryName("");
      setIsEditingCategory(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
    setIsEditingCategory(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button size="sm" onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(null)}
        >
          All
        </Button>

        {isLoading ? (
          <>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="flex items-center gap-1">
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory(category.id)}
                className="relative group"
              >
                {category.name}
                
                <div className="absolute right-0 top-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-4 w-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category.id);
                    }}
                  >
                    &times;
                  </Button>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(category);
                }}
              >
                ✏️
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add Category Sheet */}
      <Sheet open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Category</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-2"
              placeholder="Enter category name"
            />
          </div>
          <SheetFooter>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Category Sheet */}
      <Sheet open={isEditingCategory} onOpenChange={setIsEditingCategory}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <Label htmlFor="edit-category-name">Category Name</Label>
            <Input
              id="edit-category-name"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              className="mt-2"
              placeholder="Enter category name"
            />
          </div>
          <SheetFooter>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
