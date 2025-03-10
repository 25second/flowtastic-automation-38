
import { useState, useMemo, useEffect } from 'react';
import { CustomTable } from '@/components/tables/types';

export function useTableFilters(tables: CustomTable[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredTables = useMemo(() => {
    return tables?.filter(table => {
      const matchesCategory = !selectedCategory || table.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFavorites = !showFavorites || table.is_favorite;
      
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [tables, selectedCategory, searchQuery, showFavorites]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTables,
    showFavorites,
    toggleFavoritesFilter
  };
}
