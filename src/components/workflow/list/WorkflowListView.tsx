
import { useState } from 'react';
import { toast } from 'sonner';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { EditWorkflowDialog } from '@/components/workflow/list/EditWorkflowDialog';
import { Category } from '@/types/workflow';
import { WorkflowPageHeader } from '@/components/workflow/WorkflowPageHeader';

interface WorkflowListViewProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onAddWorkflow: () => void;
  onEditWorkflow: (workflow: any) => Promise<void>;
  onDeleteWorkflow: (ids: string[]) => Promise<void>;
  onToggleFavorite: (workflowId: string, isFavorite: boolean) => void;
  categories: Category[] | undefined;
  categoriesLoading: boolean;
  handleAddCategory: (name: string) => void;
  handleCategoryDelete: (categoryId: string) => Promise<void>;
  handleCategoryEdit: (category: Category) => Promise<void>;
  category: Category | null;
  handleCategorySelect: (categoryId: string | null) => void;
}

export const WorkflowListView = ({
  isLoading,
  workflows,
  onAddWorkflow,
  onEditWorkflow,
  onDeleteWorkflow,
  onToggleFavorite,
  categories,
  categoriesLoading,
  handleAddCategory,
  handleCategoryDelete,
  handleCategoryEdit,
  category,
  handleCategorySelect
}: WorkflowListViewProps) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleWorkflowRun = (workflow: any) => {
    toast.success(`Workflow "${workflow.name}" run`);
  };

  const handleWorkflowDelete = async (ids: string[]) => {
    try {
      await onDeleteWorkflow(ids);
      toast.success('Workflows deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleWorkflowEditDetails = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowEditDialog(true);
  };

  const handleSaveWorkflowDetails = async (updatedWorkflow: any) => {
    try {
      await onEditWorkflow(updatedWorkflow);
      setShowEditDialog(false);
      setSelectedWorkflow(null);
    } catch (error) {
      toast.error('Failed to update workflow');
    }
  };

  return (
    <>
      <WorkflowPageHeader onAddWorkflow={onAddWorkflow} />
      
      <WorkflowList
        isLoading={isLoading}
        workflows={workflows}
        onDelete={handleWorkflowDelete}
        onEditDetails={handleWorkflowEditDetails}
        onRun={handleWorkflowRun}
        onToggleFavorite={onToggleFavorite}
        categories={categories || []}
        categoriesLoading={categoriesLoading}
        selectedCategory={category?.id || null}
        onCategorySelect={handleCategorySelect}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleCategoryDelete}
        onEditCategory={handleCategoryEdit}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWorkflow={onAddWorkflow}
      />
      
      {selectedWorkflow && (
        <EditWorkflowDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          workflow={selectedWorkflow}
          onSave={handleSaveWorkflowDetails}
          categories={categories || []}
        />
      )}
    </>
  );
};
