
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

  const {
    fetchCategories
  } = useCategoryQueries(setCategories, setLoading, createDefaultCategory);

  const {
    createDefaultCategory,
    addCategory,
    deleteCategory,
    editCategory
  } = useCategoryMutations(fetchCategories, setSelectedCategory);

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
