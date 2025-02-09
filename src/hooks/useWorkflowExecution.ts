
import { toast } from 'sonner';

export const useWorkflowExecution = (serverUrl: string | null) => {
  const startWorkflow = async (nodes: any[], edges: any[], browserPort: number) => {
    if (!serverUrl) {
      toast.error('Please select a server to execute the workflow');
      return;
    }

    try {
      await toast.promise(
        fetch(`${serverUrl}/execute-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges, browserPort })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to execute workflow');
          const data = await res.json();
          console.log('Workflow execution response:', data);
        }),
        {
          loading: `Executing workflow in browser on port ${browserPort}...`,
          success: `Workflow completed successfully in browser on port ${browserPort}!`,
          error: `Failed to execute workflow in browser on port ${browserPort}`
        }
      );
    } catch (error) {
      console.error('Workflow execution error:', error);
    }
  };

  return {
    startWorkflow,
  };
};
