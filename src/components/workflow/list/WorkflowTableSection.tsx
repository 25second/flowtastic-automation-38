
import { BulkActions } from './BulkActions';
import { WorkflowTable } from './WorkflowTable';
import { Category } from '@/types/workflow';

interface WorkflowTableSectionProps {
  selectedWorkflows: string[];
  handleBulkDelete: () => void;
  workflowsToDisplay: any[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  onDelete?: (ids: string[]) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  categories: Category[];
}

export function WorkflowTableSection({
  selectedWorkflows,
  handleBulkDelete,
  workflowsToDisplay,
  onSelect,
  onSelectAll,
  onEditDetails,
  onRun,
  onDelete,
  onToggleFavorite,
  categories,
}: WorkflowTableSectionProps) {
  return (
    <div className="space-y-4">
      {selectedWorkflows.length > 0 && (
        <BulkActions selectedCount={selectedWorkflows.length} onBulkDelete={handleBulkDelete} />
      )}

      <WorkflowTable
        workflows={workflowsToDisplay}
        selectedWorkflows={selectedWorkflows}
        onSelect={onSelect}
        onSelectAll={onSelectAll}
        onEditDetails={onEditDetails}
        onRun={onRun}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        categories={categories}
      />
    </div>
  );
}
