
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SettingsHeaderProps {
  onSave?: () => void;
}

export const SettingsHeader = ({
  onSave
}: SettingsHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      {onSave && (
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          {t('app.save')}
        </Button>
      )}
    </div>
  );
};
