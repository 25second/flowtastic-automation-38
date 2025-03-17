
import { useAgentState } from "./useAgentState";
import { useAgentQueries } from "./useAgentQueries";
import { useAgentMutations } from "./useAgentMutations";
import { useCallback } from "react";

export type { Agent } from "./types";

export function useAgents() {
  const {
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
    showFavorites,
    toggleFavoritesFilter,
    getFilteredAgents
  } = useAgentState();

  const { fetchAgents } = useAgentQueries(setAgents, setLoading);

  const {
    handleStartAgent,
    handleStopAgent,
    handleDeleteAgent,
    handleToggleFavorite,
    handleBulkStart: bulkStart,
    handleBulkStop: bulkStop,
    handleBulkDelete: bulkDelete
  } = useAgentMutations(fetchAgents, setSelectedAgents);

  // Get filtered agents based on search query and favorites
  const filteredAgents = getFilteredAgents(agents);

  // Handlers with proper memoization using useCallback
  const handleSelectAgent = useCallback((agentId: string) => {
    setSelectedAgents(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(agentId)) {
        newSelected.delete(agentId);
      } else {
        newSelected.add(agentId);
      }
      return newSelected;
    });
  }, [setSelectedAgents]);

  const handleSelectAll = useCallback(() => {
    const allSelected = filteredAgents.every(agent => 
      selectedAgents.has(agent.id)
    );
    
    if (allSelected) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(
        filteredAgents.map(agent => agent.id)
      ));
    }
  }, [filteredAgents, selectedAgents, setSelectedAgents]);

  // Wrap bulk operations
  const handleBulkStart = useCallback(() => 
    bulkStart(selectedAgents), [bulkStart, selectedAgents]);
    
  const handleBulkStop = useCallback(() => 
    bulkStop(selectedAgents), [bulkStop, selectedAgents]);
    
  const handleBulkDelete = useCallback(() => 
    bulkDelete(selectedAgents), [bulkDelete, selectedAgents]);

  return {
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedAgents,
    filteredAgents,
    loading,
    showFavorites,
    toggleFavoritesFilter,
    handleSelectAgent,
    handleSelectAll,
    handleStartAgent,
    handleStopAgent,
    handleDeleteAgent,
    handleToggleFavorite,
    handleBulkStart,
    handleBulkStop,
    handleBulkDelete,
    fetchAgents
  };
}
