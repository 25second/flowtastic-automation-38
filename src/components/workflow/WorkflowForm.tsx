
interface WorkflowFormProps {
  workflowName: string;
  workflowDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
}

export const WorkflowForm = ({
  workflowName,
  workflowDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
}: WorkflowFormProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <input
        type="text"
        placeholder="Workflow name"
        value={workflowName}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={workflowDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded"
      />
      <button
        onClick={onSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Workflow
      </button>
    </div>
  );
};
