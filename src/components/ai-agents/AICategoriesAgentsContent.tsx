
import { useAgents } from "@/hooks/ai-agents/useAgents";
import { useAgentCategories } from "@/hooks/ai-agents/useAgentCategories";
import { AgentCategories } from "./categories/AgentCategories";
import { AgentListView } from "@/components/ai-agents/agent-list/AgentListView";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export function AICategoriesAgentsContent() {
  const { t } = useLanguage();
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Get agents data from our hooks
  const {
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
    handleToggleFavorite,
    handleBulkStart,
    handleBulkStop,
    handleBulkDelete,
    fetchAgents
  } = useAgents();

  // Get categories data from our hooks
  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    editCategory
  } = useAgentCategories();

  // Clear any previous errors when hooks load successfully
  useEffect(() => {
    setError(null);
  }, []);

  const handleRefresh = () => {
    setIsRetrying(true);
    setError(null);
    
    // Attempt to refresh data
    Promise.all([
      fetchAgents()
    ]).catch(err => {
      console.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh data");
      toast.error("Failed to refresh data");
    }).finally(() => {
      setIsRetrying(false);
    });
  };

  // Filter agents by category and favorites
  const filteredByCategory = filteredAgents.filter(agent => {
    if (!agent) return false; // Skip invalid agents
    
    const matchesCategory = !selectedCategory || agent.category_id === selectedCategory;
    const matchesFavorite = !showFavorites || agent.is_favorite;
    return matchesCategory && matchesFavorite;
  });

  // Get only agent-related categories
  const agentCategories = categories.filter(category => {
    return filteredAgents.some(agent => agent.category_id === category.id);
  });

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRetrying}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRetrying}
            >
              {isRetrying ? 'Trying...' : 'Try again'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <AgentCategories 
        categories={agentCategories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
        onAddCategory={addCategory} 
        onDeleteCategory={deleteCategory} 
        onEditCategory={editCategory} 
        isLoading={categoriesLoading} 
      />

      <AgentListView 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        selectedAgents={selectedAgents}
        filteredAgents={filteredByCategory}
        onSelectAgent={handleSelectAgent}
        onSelectAll={handleSelectAll}
        onStartAgent={handleStartAgent}
        onStopAgent={handleStopAgent}
        onDeleteAgent={handleDeleteAgent}
        onToggleFavorite={handleToggleFavorite}
        onBulkStart={handleBulkStart}
        onBulkStop={handleBulkStop}
        onBulkDelete={handleBulkDelete}
        fetchAgents={fetchAgents}
        showFavorites={showFavorites}
        onToggleFavorites={toggleFavoritesFilter}
        loading={loading}
      />
    </div>
  );
}
