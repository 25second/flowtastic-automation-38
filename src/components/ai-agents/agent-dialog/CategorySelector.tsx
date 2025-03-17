
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from '@/components/ui/form';
import { Category } from '@/hooks/categories/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySelectorProps {
  categories: Category[];
  isLoading: boolean;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategorySelector({
  categories,
  isLoading,
  selectedCategory,
  onCategoryChange
}: CategorySelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <FormLabel>Category</FormLabel>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <FormLabel>Category</FormLabel>
      <Select 
        value={selectedCategory || ""}
        onValueChange={(value) => onCategoryChange(value || null)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">No Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
