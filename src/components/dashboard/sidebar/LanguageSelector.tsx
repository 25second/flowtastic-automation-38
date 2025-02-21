
import { Languages } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Language {
  name: string;
  code: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLang: string;
  onLanguageChange: (langCode: string) => void;
}

export function LanguageSelector({ languages, selectedLang, onLanguageChange }: LanguageSelectorProps) {
  const selectedLanguage = languages.find(lang => lang.code === selectedLang);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-4 w-full px-5 py-6 rounded-md">
            <div className="relative z-10">
              <Languages className="h-6 w-6" />
            </div>
            <span className="text-[15px] font-medium">Language</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-sm">{selectedLanguage?.flag}</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {languages.map(lang => (
            <DropdownMenuItem 
              key={lang.code} 
              onClick={() => onLanguageChange(lang.code)}
              className="flex items-center justify-between"
            >
              <span>{lang.name}</span>
              <span>{lang.flag}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
