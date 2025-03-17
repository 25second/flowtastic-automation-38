import { useState, useEffect, useCallback } from "react";
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

  // Safe filtering function with error handling
  const getFilteredAgents = useCallback((agentList: Agent[]): Agent[] => {
    try {
      if (!agentList || !Array.isArray(agentList)) {
        console.warn("Invalid agent list for filtering:", agentList);
        return [];
      }
      
      return agentList.filter(agent => {
        if (!agent) return false;
        
        try {
          const searchLower = (searchQuery || "").toLowerCase();
          const agentName = (agent.name || "").toLowerCase();
          const agentStatus = (agent.status || "").toLowerCase();
          const agentDescription = (agent.description || "").toLowerCase();
          
          return agentName.includes(searchLower) || 
                 agentStatus.includes(searchLower) || 
                 agentDescription.includes(searchLower);
        } catch (err) {
          console.error("Error filtering individual agent:", err, agent);
          return false;
        }
      });
    } catch (err) {
      console.error("Error filtering agents:", err);
      setError(err instanceof Error ? err : new Error("Failed to filter agents"));
      return [];
    }
  }, [searchQuery]);

  const handleSelectAgent = useCallback((agentId: string) => {
    try {
      if (!agentId) {
        console.warn("Invalid agent ID for selection");
        return;
      }
      
      setSelectedAgents(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(agentId)) {
          newSelected.delete(agentId);
        } else {
          newSelected.add(agentId);
        }
        return newSelected;
      });
    } catch (err) {
      console.error("Error selecting agent:", err);
      setError(err instanceof Error ? err : new Error("Failed to select agent"));
    }
  }, []);

  const handleSelectAll = useCallback((filteredAgents: Agent[]) => {
    try {
      if (!filteredAgents || !Array.isArray(filteredAgents)) {
        console.warn("Invalid agent list for select all:", filteredAgents);
        return;
      }
      
      setSelectedAgents(prev => {
        if (prev.size === filteredAgents.length) {
          // If all are selected, clear selection
          return new Set();
        } else {
          // Otherwise select all
          const validIds = filteredAgents
            .filter(agent => agent && agent.id)
            .map(agent => agent.id);
          return new Set(validIds);
        }
      });
    } catch (err) {
      console.error("Error selecting all agents:", err);
      setError(err instanceof Error ? err : new Error("Failed to select all agents"));
    }
  }, []);

  // Reset selected agents when agents list changes
  useEffect(() => {
    if (agents.length === 0) {
      setSelectedAgents(new Set());
    }
  }, [agents]);

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
