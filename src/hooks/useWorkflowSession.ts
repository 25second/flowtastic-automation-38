
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@/types/workflow';
import { toast } from 'sonner';

export const useWorkflowSession = () => {
  const navigate = useNavigate();
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  const handleRun = async () => {
    setShowSessionDialog(true);
  };

  const handleRunWithSessions = async (selectedSessions: Session[], workflowId: string) => {
    toast.info("Running workflow with selected sessions...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { error } = await supabase.functions.invoke('run-workflow', {
        body: { 
          workflowId,
          sessions: selectedSessions.map(s => s.uuid)
        },
      });

      if (error) throw error;
      toast.success("Workflow started successfully");
    } catch (error) {
      console.error("Error running workflow:", error);
      toast.error("Error running workflow");
    }
  };

  return {
    showSessionDialog,
    setShowSessionDialog,
    handleRun,
    handleRunWithSessions
  };
};
