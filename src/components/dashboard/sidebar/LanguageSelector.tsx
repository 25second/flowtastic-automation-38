
import { useLanguage } from '@/hooks/useLanguage';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button 
          onClick={toggleLanguage} 
          className="flex items-center gap-4 w-full px-5 py-6 rounded-md transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative z-10">
            <Languages className="h-6 w-6" />
          </div>
          <span className="relative z-10 text-[15px] font-medium">
            {language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
          </span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
