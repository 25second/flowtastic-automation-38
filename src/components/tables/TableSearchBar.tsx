
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddTable?: () => void; // Added this optional prop
}

export const TableSearchBar = ({
  searchQuery,
  onSearchChange,
}: TableSearchBarProps) => {
  const { t } = useLanguage();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full max-w-md mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('tables.searchPlaceholder')}
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
