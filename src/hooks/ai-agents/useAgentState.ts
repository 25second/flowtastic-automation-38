
import { useState } from "react";
import { Agent } from "@/hooks/ai-agents/types";

export function useAgentState() {
  console.log("Initializing useAgentState");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter agents based on search query
  const getFilteredAgents = (agentList: Agent[]): Agent[] => {
    console.log("Filtering agents:", agentList.length);
    return agentList.filter(agent => {
      const searchLower = searchQuery.toLowerCase();
      const matchName = agent.name.toLowerCase().includes(searchLower);
      const matchStatus = agent.status.toLowerCase().includes(searchLower);
      const matchDescription = agent.description?.toLowerCase().includes(searchLower) || false;
      
      return matchName || matchStatus || matchDescription;
    });
  };

  const handleSelectAgent = (agentId: string) => {
    const newSelected = new Set(selectedAgents);
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId);
    } else {
      newSelected.add(agentId);
    }
    setSelectedAgents(newSelected);
  };

  const handleSelectAll = (filteredAgents: Agent[]) => {
    if (selectedAgents.size === filteredAgents.length) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map(agent => agent.id)));
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
    getFilteredAgents,
    handleSelectAgent,
    handleSelectAll
  };
}
