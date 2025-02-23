
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WriteModeSettingProps {
  settingKey: string;
  value: string;
  onChange: (value: string) => void;
}

export const WriteModeSetting = ({ settingKey, value, onChange }: WriteModeSettingProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={settingKey} className="text-sm font-medium">
          Write Mode
        </Label>
        <Switch
          id={settingKey}
          checked={value === 'overwrite'}
          onCheckedChange={(checked) => onChange(checked ? 'overwrite' : 'empty-cells')}
        />
      </div>
      <p className="text-xs text-gray-500">
        {value === 'overwrite' ? 'Overwrite existing data' : 'Write to empty cells only'}
      </p>
    </div>
  );
};
