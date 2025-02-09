
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowForm } from '@/components/workflow/WorkflowForm';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';

export default function Dashboard() {
  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
  } = useWorkflowManager([] as Node[], [] as Edge[]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Workflow Dashboard</h1>
      
      <WorkflowForm
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={setWorkflowName}
        onDescriptionChange={setWorkflowDescription}
        onSave={() => saveWorkflow.mutate()}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Workflows</h2>
        <WorkflowList
          workflows={workflows}
          isLoading={isLoading}
          onDelete={(id) => deleteWorkflow.mutate(id)}
        />
      </div>
    </div>
  );
}
