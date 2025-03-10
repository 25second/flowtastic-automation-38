
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TablePageHeaderProps {
  onAddTable: () => void;
}

export const TablePageHeader = ({
  onAddTable
}: TablePageHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{t('sidebar.tables')}</h1>
    </div>
  );
};
