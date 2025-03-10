
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddTable?: () => void;
  showFavorites?: boolean;
  onToggleFavorites?: () => void;
}

export const TableSearchBar = ({
  searchQuery,
  onSearchChange,
  onAddTable,
  showFavorites = false,
  onToggleFavorites
}: TableSearchBarProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('tables.searchPlaceholder')}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        {onToggleFavorites && (
          <Button
            variant={showFavorites ? "default" : "outline"}
            onClick={onToggleFavorites}
            className="gap-2"
          >
            <Star className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            Favorites
          </Button>
        )}
        
        {onAddTable && (
          <Button onClick={onAddTable}>
            <Plus className="h-4 w-4 mr-2" />
            {t('tables.newTable')}
          </Button>
        )}
      </div>
    </div>
  );
}
