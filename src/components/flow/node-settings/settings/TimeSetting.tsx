
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSettingProps {
  settingKey: string;
  value: string;
  onChange: (value: string) => void;
}

export const TimeSetting = ({ settingKey, value, onChange }: TimeSettingProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
      <Input
        type="time"
        id={settingKey}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
