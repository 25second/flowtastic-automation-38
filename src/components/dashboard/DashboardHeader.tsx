
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

export function DashboardHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{t('sidebar.dashboard')}</h1>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
    </div>
  );
}
