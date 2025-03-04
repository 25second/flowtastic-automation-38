
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">2captcha API Key</Label>
        <Input
          id="captcha"
          type="password"
          placeholder="Enter API key"
          value={captchaToken}
          onChange={e => setCaptchaToken(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}
