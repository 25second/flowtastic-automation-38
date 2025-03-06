
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessengersSettingsProps {
  telegramToken: string;
  setTelegramToken: (value: string) => void;
  slackToken: string;
  setSlackToken: (value: string) => void;
}

export function MessengersSettings({
  telegramToken,
  setTelegramToken,
  slackToken,
  setSlackToken
}: MessengersSettingsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.messengers.telegramToken')}</Label>
        <Input
          type="password"
          value={telegramToken}
          onChange={(e) => setTelegramToken(e.target.value)}
          placeholder="1234567890:ABCDefGhIJKlmnOPQRstUVwxyZ"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">{t('settings.messengers.slackToken')}</Label>
        <Input
          type="password"
          value={slackToken}
          onChange={(e) => setSlackToken(e.target.value)}
          placeholder="xoxb-..."
        />
      </div>
    </div>
  );
}
