
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Settings2 } from "lucide-react";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onShowAddDialog: () => void;
  onShowManageDialog: () => void;
}

export const CategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onShowAddDialog,
  onShowManageDialog,
}: CategoryListProps) => {
  return (
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
              onClick={onShowAddDialog}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onShowManageDialog}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
