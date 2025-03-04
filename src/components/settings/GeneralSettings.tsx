
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Interface Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Theme</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Accent Color</Label>
        <div className="grid grid-cols-8 gap-3 p-1">
          {accentColors.map(color => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                accentColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setAccentColor(color.value)}
              aria-label={`Select ${color.name} as accent color`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
