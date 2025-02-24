
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OtherSettingsProps {
  captchaToken: string;
  setCaptchaToken: (value: string) => void;
}

export function OtherSettings({
  captchaToken,
  setCaptchaToken
}: OtherSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="captcha">2captcha API Key</Label>
        <Input
          id="captcha"
          type="password"
          placeholder="Введите API ключ"
          value={captchaToken}
          onChange={e => setCaptchaToken(e.target.value)}
        />
      </div>
    </div>
  );
}
