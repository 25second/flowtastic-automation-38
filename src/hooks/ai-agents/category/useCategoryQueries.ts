// This file is now replaced by the more generic src/hooks/categories/useCategoryQueries.ts
// Keeping this stub for backward compatibility temporarily
import { useCategoryQueries as useSharedCategoryQueries } from '@/hooks/categories/useCategoryQueries';

export function useCategoryQueries(
  setCategories: (categories: any[]) => void,
  setLoading: (loading: boolean) => void
) {
  return useSharedCategoryQueries('agent_categories', setCategories, setLoading);
}
