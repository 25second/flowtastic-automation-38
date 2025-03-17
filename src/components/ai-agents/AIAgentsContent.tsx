
import { useAgents } from "@/hooks/ai-agents/useAgents";
import { useAgentCategories } from "@/hooks/ai-agents/useAgentCategories";
import { AgentCategories } from "./categories/AgentCategories";
import { AgentListView } from "./AgentListView";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Plus, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIAgentsContent() {
  const { t } = useLanguage();
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Wrap the hooks in try/catch to prevent rendering failures
  try {
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

    // Filter agents by category and favorites
    const filteredByCategory = filteredAgents.filter(agent => {
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
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
  } catch (err) {
    // Handle errors from hooks to prevent white screen
    useEffect(() => {
      console.error("Error in AIAgentsContent:", err);
      setError(err instanceof Error ? err.message : "Failed to load AI Agents");
    }, [err]);

    // Render a fallback UI when hooks fail
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Agents</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to load agents</AlertTitle>
          <AlertDescription>
            {error || "There was an error loading the AI Agents. Please try refreshing the page."}
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Refresh page
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
