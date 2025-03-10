
import { useState } from 'react';
import { useTableCategories } from '@/hooks/tables/useTableCategories';
import { useTableOperations } from '@/hooks/tables/useTableOperations';
import { useTableFilters } from '@/hooks/tables/useTableFilters';
import { TablePageHeader } from './TablePageHeader';
import { HeaderSection } from '@/components/workflow/list/HeaderSection';
import { TableContent } from './TableContent';
import { TableActions } from './TableActions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function TablesList() {
  const {
    tables,
    isLoading,
    isCreating,
    setIsCreating,
    handleCreateTable,
    handleImportTable,
    handleDeleteTable,
    refetch
  } = useTableOperations();

  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    editCategory
  } = useTableCategories();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory: filterSelectedCategory,
    setSelectedCategory: setFilterSelectedCategory,
    filteredTables,
    showFavorites,
    toggleFavoritesFilter
  } = useTableFilters(tables);

  // Sync the selected category between the categories component and filters
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setFilterSelectedCategory(category);
  };

  const handleAddTable = () => {
    setIsCreating(true);
  };

  const handleToggleFavorite = async (tableId: string, isFavorite: boolean) => {
    try {
      // We need to cast the update data to any since the type definition doesn't include is_favorite
      const updateData: any = { is_favorite: isFavorite };
      
      const { error } = await supabase
        .from('custom_tables')
        .update(updateData)
        .eq('id', tableId);

      if (error) throw error;
      
      toast.success(`${isFavorite ? 'Added to' : 'Removed from'} favorites`);
      refetch(); // Refresh the table list
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <div className="space-y-6">
      <TablePageHeader onAddTable={handleAddTable} />
      
      <HeaderSection
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWorkflow={handleAddTable}
        showFavorites={showFavorites}
        onToggleFavorites={toggleFavoritesFilter}
      />

      {isCreating && (
        <TableActions 
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          onCreateTable={handleCreateTable}
          onImportTable={handleImportTable}
          categories={categories}
          selectedCategory={selectedCategory}
        />
      )}

      <TableContent 
        tables={filteredTables} 
        isLoading={isLoading} 
        categories={categories}
        onDeleteTable={handleDeleteTable}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
