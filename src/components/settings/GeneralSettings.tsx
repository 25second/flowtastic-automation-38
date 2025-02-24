
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { accentColors } from "@/constants/accentColors";

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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Язык интерфейса</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите язык" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Цветовая схема</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите тему" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Светлая</SelectItem>
            <SelectItem value="dark">Тёмная</SelectItem>
            <SelectItem value="system">Системная</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Акцентный цвет</Label>
        <div className="grid grid-cols-8 gap-2 p-1">
          {accentColors.map(color => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2 ${
                accentColor === color.value ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setAccentColor(color.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
