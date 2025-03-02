
import { useState } from 'react';
import { WorkflowFilters } from './list/WorkflowFilters';
import { WorkflowListHeader } from './list/WorkflowListHeader';
import { WorkflowItem } from './list/WorkflowItem';
import { WorkflowCategories } from './list/WorkflowCategories';
import { toast } from 'sonner';
import { Category } from '@/types/workflow';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete?: (ids: string[]) => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  categories: Category[];
  categoriesLoading?: boolean;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (category: Category) => void;
  searchQuery?: string;
}

export const WorkflowList = ({ 
  isLoading, 
  workflows, 
  onDelete, 
  onEditDetails,
  onRun,
  categories,
  categoriesLoading = false,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  searchQuery = '',
}: WorkflowListProps) => {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  const filteredWorkflows = workflows?.filter(workflow => {
    if (!workflow) return false;

    const searchLower = searchQuery.toLowerCase();
    const name = workflow.name?.toLowerCase() || '';
    const description = workflow.description?.toLowerCase() || '';
    const tags = workflow.tags || [];

    const matchesSearch = 
      name.includes(searchLower) || 
      description.includes(searchLower) || 
      tags.some((tag: string) => tag.toLowerCase().includes(searchLower));
    
    const categoryMatch = !selectedCategory || workflow.category === selectedCategory;

    return matchesSearch && categoryMatch;
  });

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows?.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows?.map(w => w.id) || []);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedWorkflows.length === 0) {
      toast.error("Please select workflows to delete");
      return;
    }
    onDelete?.(selectedWorkflows);
    setSelectedWorkflows([]);
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading workflows...</p>;
  }

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

      <WorkflowListHeader
        selectedCount={selectedWorkflows.length}
        totalCount={filteredWorkflows?.length || 0}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="grid gap-4">
        {filteredWorkflows?.map((workflow) => (
          <WorkflowItem
            key={workflow.id}
            workflow={workflow}
            isSelected={selectedWorkflows.includes(workflow.id)}
            onSelect={handleSelect}
            onEditDetails={onEditDetails}
            onDelete={onDelete}
            onRun={onRun}
          />
        ))}
      </div>

      {(!filteredWorkflows || filteredWorkflows.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          {workflows && workflows.length > 0 
            ? 'No workflows found matching your filters'
            : 'No workflows found'}
        </div>
      )}
    </div>
  );
}
