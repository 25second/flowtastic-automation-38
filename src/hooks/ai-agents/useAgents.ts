
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  status: 'idle' | 'running' | 'completed' | 'error';
  category_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useAgents() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

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

      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = agent.name.toLowerCase().includes(searchLower);
    const matchStatus = agent.status.toLowerCase().includes(searchLower);
    const matchDescription = agent.description?.toLowerCase().includes(searchLower) || false;
    
    return matchName || matchStatus || matchDescription;
  });

  const handleSelectAgent = (agentId: string) => {
    const newSelected = new Set(selectedAgents);
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId);
    } else {
      newSelected.add(agentId);
    }
    setSelectedAgents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedAgents.size === filteredAgents.length) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map(agent => agent.id)));
    }
  };

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

  const handleBulkStart = async () => {
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

  const handleBulkStop = async () => {
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

  const handleBulkDelete = async () => {
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
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedAgents,
    filteredAgents,
    loading,
    handleSelectAgent,
    handleSelectAll,
    handleStartAgent,
    handleStopAgent,
    handleDeleteAgent,
    handleBulkStart,
    handleBulkStop,
    handleBulkDelete,
    fetchAgents
  };
}
