
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Telegram Bot Token</Label>
        <Input
          id="telegram"
          type="password"
          placeholder="Enter bot token"
          value={telegramToken}
          onChange={e => setTelegramToken(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Slack API Token</Label>
        <Input
          id="slack"
          type="password"
          placeholder="Enter API token"
          value={slackToken}
          onChange={e => setSlackToken(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}
