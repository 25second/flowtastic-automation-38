
import { useState, useMemo, useEffect } from 'react';
import { CustomTable } from '@/components/tables/types';

export function useTableFilters(tables: CustomTable[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTables = useMemo(() => {
    return tables?.filter(table => {
      const matchesCategory = !selectedCategory || table.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [tables, selectedCategory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTables
  };
}
