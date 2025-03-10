
import { useState } from 'react';
import { Category } from './types';

export function useCategoryState() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return {
    categories,
    setCategories,
    loading,
    setLoading,
    selectedCategory,
    setSelectedCategory
  };
}
