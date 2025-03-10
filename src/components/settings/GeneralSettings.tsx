
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { accentColors } from "@/constants/accentColors";
import { useLanguage } from "@/contexts/LanguageContext";

interface GeneralSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
}

export function GeneralSettings({
  language,
  setLanguage,
  theme,
  setTheme,
  accentColor,
  setAccentColor
}: GeneralSettingsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.language')}</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('settings.language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.theme')}</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('settings.theme')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">{t('settings.theme.light')}</SelectItem>
            <SelectItem value="dark">{t('settings.theme.dark')}</SelectItem>
            <SelectItem value="system">{t('settings.theme.system')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.accentColor')}</Label>
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 p-1 max-h-48 overflow-y-auto">
          {accentColors.map(color => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                accentColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setAccentColor(color.value)}
              aria-label={`Select ${color.name} as accent color`}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
