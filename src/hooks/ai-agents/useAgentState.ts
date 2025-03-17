
import { useState, useEffect } from "react";
import { Agent } from "@/hooks/ai-agents/types";

export function useAgentState() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Reset error when dependencies change
  useEffect(() => {
    setError(null);
  }, [searchQuery, isAddDialogOpen]);

  // Filter agents based on search query
  const getFilteredAgents = (agentList: Agent[]): Agent[] => {
    try {
      if (!agentList || !Array.isArray(agentList)) {
        return [];
      }
      
      return agentList.filter(agent => {
        if (!agent) return false;
        
        const searchLower = (searchQuery || "").toLowerCase();
        const matchName = (agent.name || "").toLowerCase().includes(searchLower);
        const matchStatus = (agent.status || "").toLowerCase().includes(searchLower);
        const matchDescription = (agent.description || "").toLowerCase().includes(searchLower);
        
        return matchName || matchStatus || matchDescription;
      });
    } catch (err) {
      console.error("Error filtering agents:", err);
      return [];
    }
  };

  const handleSelectAgent = (agentId: string) => {
    try {
      const newSelected = new Set(selectedAgents);
      if (newSelected.has(agentId)) {
        newSelected.delete(agentId);
      } else {
        newSelected.add(agentId);
      }
      setSelectedAgents(newSelected);
    } catch (err) {
      console.error("Error selecting agent:", err);
      setError(err instanceof Error ? err : new Error("Failed to select agent"));
    }
  };

  const handleSelectAll = (filteredAgents: Agent[]) => {
    try {
      if (!filteredAgents || !Array.isArray(filteredAgents)) {
        return;
      }
      
      if (selectedAgents.size === filteredAgents.length) {
        setSelectedAgents(new Set());
      } else {
        setSelectedAgents(new Set(filteredAgents.map(agent => agent.id)));
      }
    } catch (err) {
      console.error("Error selecting all agents:", err);
      setError(err instanceof Error ? err : new Error("Failed to select all agents"));
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedAgents,
    setSelectedAgents,
    agents,
    setAgents,
    loading,
    setLoading,
    error,
    setError,
    getFilteredAgents,
    handleSelectAgent,
    handleSelectAll
  };
}
