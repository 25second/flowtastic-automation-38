// This file is now replaced by the more generic src/hooks/categories/useCategoryMutations.ts
// Keeping this stub for backward compatibility temporarily
import { useCategoryMutations as useSharedCategoryMutations } from '@/hooks/categories/useCategoryMutations';

export function useCategoryMutations(
  fetchCategories: () => Promise<void>,
  setSelectedCategory: (categoryId: string | null) => void,
  createDefaultCategory: () => Promise<void>
) {
  return useSharedCategoryMutations('agent_categories', fetchCategories, setSelectedCategory);
}
