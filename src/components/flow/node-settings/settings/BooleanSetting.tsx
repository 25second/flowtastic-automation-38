
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BooleanSettingProps {
  settingKey: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export const BooleanSetting = ({ settingKey, value, onChange }: BooleanSettingProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={settingKey}
        checked={value || false}
        onCheckedChange={onChange}
      />
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
    </div>
  );
};
