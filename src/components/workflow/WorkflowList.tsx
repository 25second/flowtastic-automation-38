
import { useState } from 'react';
import { toast } from 'sonner';
import { WorkflowCategories } from './list/WorkflowCategories';
import { WorkflowSearchBar } from './list/WorkflowSearchBar';
import { BulkActions } from './list/BulkActions';
import { WorkflowTable } from './list/WorkflowTable';
import { useWorkflowListState } from '@/hooks/workflow/useWorkflowListState';
import { Category } from '@/types/workflow';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete?: (ids: string[]) => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  categories: Category[];
  categoriesLoading?: boolean;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (category: Category) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onAddWorkflow?: () => void;
}

export const WorkflowList = ({ 
  isLoading, 
  workflows = [], 
  onDelete, 
  onEditDetails,
  onRun,
  onToggleFavorite,
  categories,
  categoriesLoading = false,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  onAddWorkflow
}: WorkflowListProps) => {
  const {
    selectedWorkflows,
    searchQuery: internalSearchQuery,
    setSearchQuery: internalSetSearchQuery,
    showFavorites,
    toggleFavoritesFilter,
    filteredWorkflows,
    filteredByCategory,
    handleSelectAll,
    handleSelect,
    handleBulkDelete
  } = useWorkflowListState(workflows, onDelete);

  // Use external state if provided, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const handleSearchChange = (value: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(value);
    } else {
      internalSetSearchQuery(value);
    }
  };

  const workflowsToDisplay = selectedCategory ? 
    filteredByCategory(selectedCategory) : 
    filteredWorkflows;

  if (isLoading) {
    return <p className="text-muted-foreground">Loading workflows...</p>;
  }

  return (
    <div className="w-full space-y-4">
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
        onSearchChange={handleSearchChange}
        onAddWorkflow={onAddWorkflow}
        showFavorites={showFavorites}
        onToggleFavorites={toggleFavoritesFilter}
      />

      {selectedWorkflows.length > 0 && (
        <BulkActions
          selectedCount={selectedWorkflows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <WorkflowTable
        workflows={workflowsToDisplay}
        selectedWorkflows={selectedWorkflows}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onEditDetails={onEditDetails}
        onRun={onRun}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
