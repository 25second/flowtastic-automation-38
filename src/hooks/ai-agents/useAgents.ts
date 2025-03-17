
import { useAgentState } from "./useAgentState";
import { useAgentQueries } from "./useAgentQueries";
import { useAgentMutations } from "./useAgentMutations";

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
    getFilteredAgents,
    handleSelectAgent,
    handleSelectAll
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

  // Wrap bulk operations to pass the current selected agents
  const handleBulkStart = () => bulkStart(selectedAgents);
  const handleBulkStop = () => bulkStop(selectedAgents);
  const handleBulkDelete = () => bulkDelete(selectedAgents);

  // Add wrapper for handleSelectAll to pass the filtered agents
  const handleSelectAllWrapper = () => handleSelectAll(filteredAgents);

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
    handleSelectAll: handleSelectAllWrapper,
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
