
import { useCategoryState } from './category/useCategoryState';
import { useCategoryQueries } from './category/useCategoryQueries';
import { useCategoryMutations } from './category/useCategoryMutations';

export const useAgentCategories = () => {
  const {
    categories,
    setCategories,
    loading,
    setLoading,
    selectedCategory,
    setSelectedCategory
  } = useCategoryState();

  // First get the queries (includes createDefaultCategory)
  const {
    fetchCategories,
    createDefaultCategory
  } = useCategoryQueries(setCategories, setLoading);

  // Then pass functions to mutations
  const {
    addCategory,
    deleteCategory,
    editCategory
  } = useCategoryMutations(fetchCategories, setSelectedCategory, createDefaultCategory);

  return {
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchCategories,
    addCategory,
    deleteCategory,
    editCategory
  };
};
