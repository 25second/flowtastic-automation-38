
import { WorkflowCategories } from './WorkflowCategories';
import { WorkflowSearchBar } from './WorkflowSearchBar';
import { Category } from '@/types/workflow';

interface HeaderSectionProps {
  categories: Category[];
  categoriesLoading: boolean;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddWorkflow?: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

export function HeaderSection({
  categories,
  categoriesLoading,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  searchQuery,
  onSearchChange,
  onAddWorkflow,
  showFavorites,
  onToggleFavorites,
}: HeaderSectionProps) {
  return (
    <div className="space-y-4">
      <WorkflowCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onCategorySelect}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onEditCategory={onEditCategory}
        isLoading={categoriesLoading}
      />

      <WorkflowSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddWorkflow={onAddWorkflow}
        showFavorites={showFavorites}
        onToggleFavorites={onToggleFavorites}
      />
    </div>
  );
}
