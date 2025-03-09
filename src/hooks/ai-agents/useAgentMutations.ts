
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Agent } from "@/hooks/ai-agents/types";

export function useAgentMutations(
  fetchAgents: () => Promise<void>,
  setSelectedAgents: (selected: Set<string>) => void
) {
  const handleStartAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'running' })
        .eq('id', agentId);

      if (error) throw error;
      toast.success("Agent started successfully");
      await fetchAgents();
    } catch (error) {
      console.error('Error starting agent:', error);
      toast.error("Failed to start agent");
    }
  };

  const handleStopAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'idle' })
        .eq('id', agentId);

      if (error) throw error;
      toast.success("Agent stopped successfully");
      await fetchAgents();
    } catch (error) {
      console.error('Error stopping agent:', error);
      toast.error("Failed to stop agent");
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;
      await fetchAgents();
      toast.success("Agent deleted successfully");
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error("Failed to delete agent");
    }
  };

  const handleToggleFavorite = async (agentId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_favorite: isFavorite })
        .eq('id', agentId);

      if (error) throw error;
      await fetchAgents();
      toast.success(isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleBulkStart = async (selectedAgents: Set<string>) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'running' })
        .in('id', Array.from(selectedAgents));

      if (error) throw error;
      await fetchAgents();
      toast.success("Selected agents started successfully");
    } catch (error) {
      console.error('Error starting agents:', error);
      toast.error("Failed to start selected agents");
    }
  };

  const handleBulkStop = async (selectedAgents: Set<string>) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: 'idle' })
        .in('id', Array.from(selectedAgents));

      if (error) throw error;
      await fetchAgents();
      toast.success("Selected agents stopped successfully");
    } catch (error) {
      console.error('Error stopping agents:', error);
      toast.error("Failed to stop selected agents");
    }
  };

  const handleBulkDelete = async (selectedAgents: Set<string>) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .in('id', Array.from(selectedAgents));

      if (error) throw error;
      await fetchAgents();
      setSelectedAgents(new Set());
      toast.success("Selected agents deleted successfully");
    } catch (error) {
      console.error('Error deleting agents:', error);
      toast.error("Failed to delete selected agents");
    }
  };

  return {
    handleStartAgent,
    handleStopAgent,
    handleDeleteAgent,
    handleToggleFavorite,
    handleBulkStart,
    handleBulkStop,
    handleBulkDelete
  };
}
