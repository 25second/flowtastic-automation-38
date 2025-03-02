
// Inside the WorkflowStateProvider.tsx
// Update the handleSaveWorkflow function:

const handleSaveWorkflow = (data: { 
    id?: string; 
    nodes: FlowNodeWithData[]; 
    edges: Edge[];
  }) => {
    saveWorkflow.mutate({
      ...data,
      workflowName,
      workflowDescription,
      tags,
      category
    });
  };
