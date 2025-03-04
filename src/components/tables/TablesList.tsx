
import { useState } from 'react';
import { useTableCategories } from '@/hooks/tables/useTableCategories';
import { useTableOperations } from '@/hooks/tables/useTableOperations';
import { useTableFilters } from '@/hooks/tables/useTableFilters';
import { TablePageHeader } from './TablePageHeader';
import { TableSearchBar } from './TableSearchBar';
import { TableActions } from './TableActions';
import { TableCategories } from './categories/TableCategories';
import { TableContent } from './TableContent';

export function TablesList() {
  const {
    tables,
    isLoading,
    isCreating,
    setIsCreating,
    handleCreateTable,
    handleImportTable,
    handleDeleteTable
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
    filteredTables
  } = useTableFilters(tables);

  const handleAddTable = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <TablePageHeader onAddTable={handleAddTable} />
      
      <TableCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        isLoading={categoriesLoading}
      />

      <TableSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddTable={handleAddTable}
      />

      <TableActions 
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        onCreateTable={handleCreateTable}
        onImportTable={handleImportTable}
        categories={categories}
        selectedCategory={selectedCategory}
      />

      <TableContent 
        tables={filteredTables} 
        isLoading={isLoading} 
        categories={categories}
        onDeleteTable={handleDeleteTable}
      />
    </div>
  );
}
