
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram Bot Token</Label>
        <Input
          id="telegram"
          type="password"
          placeholder="Введите токен бота"
          value={telegramToken}
          onChange={e => setTelegramToken(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slack">Slack API Token</Label>
        <Input
          id="slack"
          type="password"
          placeholder="Введите API токен"
          value={slackToken}
          onChange={e => setSlackToken(e.target.value)}
        />
      </div>
    </div>
  );
}
