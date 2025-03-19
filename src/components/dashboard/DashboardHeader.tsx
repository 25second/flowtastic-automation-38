
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

export function DashboardHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-foreground">{t('sidebar.dashboard')}</h1>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
    </div>
  );
}
