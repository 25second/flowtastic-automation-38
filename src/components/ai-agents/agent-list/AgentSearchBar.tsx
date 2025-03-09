
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AgentSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AgentSearchBar({ searchQuery, onSearchChange }: AgentSearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search agents by name, status, or dates..."
        className="pl-9"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
}
