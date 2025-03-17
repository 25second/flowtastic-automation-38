
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/hooks/categories/types';

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
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Category
        </label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Category
      </label>
      <Select 
        value={selectedCategory || "none"}
        onValueChange={(value) => onCategoryChange(value === "none" ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Category</SelectItem>
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
