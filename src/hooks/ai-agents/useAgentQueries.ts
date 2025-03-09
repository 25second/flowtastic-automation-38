
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Agent } from "@/hooks/ai-agents/types";

export function useAgentQueries(
  setAgents: (agents: Agent[]) => void,
  setLoading: (loading: boolean) => void
) {
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      fetchAgents();
    }
  }, [session?.user]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast the data to ensure status is properly typed
      const typedData = data?.map(agent => ({
        ...agent,
        status: agent.status as 'idle' | 'running' | 'completed' | 'error'
      })) || [];
      
      setAgents(typedData);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAgents
  };
}
