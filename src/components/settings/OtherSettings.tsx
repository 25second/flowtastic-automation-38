
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface OtherSettingsProps {
  captchaToken: string;
  setCaptchaToken: (value: string) => void;
}

export function OtherSettings({
  captchaToken,
  setCaptchaToken
}: OtherSettingsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.other.captchaToken')}</Label>
        <Input
          type="password"
          value={captchaToken}
          onChange={(e) => setCaptchaToken(e.target.value)}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
      </div>
    </div>
  );
}
