
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingInputProps {
  settingKey: string;
  value: any;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

export const SettingInput = ({ settingKey, value, localSettings, onSettingChange }: SettingInputProps) => {
  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={settingKey}
          checked={localSettings[settingKey] || false}
          onCheckedChange={(checked) => onSettingChange(settingKey, checked)}
        />
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Select
          value={Array.isArray(localSettings[settingKey]) ? localSettings[settingKey].join(',') : ''}
          onValueChange={(val) => onSettingChange(settingKey, val.split(','))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select options" />
          </SelectTrigger>
          <SelectContent>
            {value.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="space-y-2">
        <Label className="capitalize">{settingKey.replace(/([A-Z])/g, ' $1')}</Label>
        <div className="pl-4 space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <SettingInput
                settingKey={`${settingKey}.${subKey}`}
                value={subValue}
                localSettings={localSettings}
                onSettingChange={onSettingChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (settingKey === 'time') {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Input
          type="time"
          id={settingKey}
          value={localSettings[settingKey] || value}
          onChange={(e) => onSettingChange(settingKey, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
      <Input
        type={typeof value === 'number' ? 'number' : 'text'}
        id={settingKey}
        value={localSettings[settingKey] || value}
        onChange={(e) => onSettingChange(settingKey, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
};
