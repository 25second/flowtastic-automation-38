
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DefaultSettingProps {
  settingKey: string;
  value: string | number;
  type: "text" | "number";
  onChange: (value: string | number) => void;
}

export const DefaultSetting = ({ settingKey, value, type, onChange }: DefaultSettingProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
      <Input
        type={type}
        id={settingKey}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
};
