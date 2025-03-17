
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AgentSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AgentSearchBar({ searchQuery, onSearchChange }: AgentSearchBarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t('search.placeholder') || "Search agents..."}
        className="pl-8 w-full md:w-[300px]"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
