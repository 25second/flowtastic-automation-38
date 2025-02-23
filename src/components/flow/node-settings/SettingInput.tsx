import { BooleanSetting } from "./settings/BooleanSetting";
import { ArraySetting } from "./settings/ArraySetting";
import { TextSetting } from "./settings/TextSetting";
import { SelectorSetting } from "./settings/SelectorSetting";
import { TimeSetting } from "./settings/TimeSetting";
import { TableSetting } from "./settings/TableSetting";
import { TableColumnSetting } from "./settings/TableColumnSetting";
import { ReadModeSetting } from "./settings/ReadModeSetting";
import { DefaultSetting } from "./settings/DefaultSetting";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SettingInputProps {
  settingKey: string;
  value: any;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
  options?: string[];
  isEmailDomain?: boolean;
}

export const SettingInput = ({ 
  settingKey, 
  value, 
  localSettings, 
  onSettingChange,
  options,
  isEmailDomain
}: SettingInputProps) => {
  if (settingKey === 'tableName') {
    return (
      <TableSetting
        settingKey={settingKey}
        value={localSettings[settingKey] || ''}
        onChange={(val) => onSettingChange(settingKey, val)}
      />
    );
  }

  if (settingKey === 'columnName') {
    return (
      <TableColumnSetting
        settingKey={settingKey}
        value={localSettings[settingKey] || ''}
        tableName={localSettings['tableName'] || ''}
        onChange={(val) => onSettingChange(settingKey, val)}
      />
    );
  }

  if (settingKey === 'readMode') {
    return (
      <ReadModeSetting
        settingKey={settingKey}
        value={localSettings[settingKey] || 'sequential'}
        onChange={(val) => onSettingChange(settingKey, val)}
      />
    );
  }

  if (isEmailDomain) {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          Email Domain
        </Label>
        <div className="flex items-center">
          <span className="mr-2">@</span>
          <Input
            id={settingKey}
            value={(localSettings[settingKey] || '').replace('@', '')}
            onChange={(e) => onSettingChange(settingKey, e.target.value)}
            placeholder="domain.com"
            className="flex-1"
          />
        </div>
      </div>
    );
  }

  if (options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Select
          value={localSettings[settingKey] || ''}
          onValueChange={(value) => onSettingChange(settingKey, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${settingKey}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <BooleanSetting
        settingKey={settingKey}
        value={localSettings[settingKey] || false}
        onChange={(checked) => onSettingChange(settingKey, checked)}
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <ArraySetting
        settingKey={settingKey}
        value={value}
        selectedValue={Array.isArray(localSettings[settingKey]) ? localSettings[settingKey].join(',') : ''}
        onChange={(val) => onSettingChange(settingKey, val.split(','))}
      />
    );
  }

  if (settingKey === 'selector') {
    return (
      <SelectorSetting
        settingKey={settingKey}
        value={value}
        localSettings={localSettings}
        onChange={onSettingChange}
      />
    );
  }

  if (settingKey === 'text' && (localSettings.type === 'page-type' || localSettings.type === 'input-text')) {
    return (
      <TextSetting
        settingKey={settingKey}
        value={value}
        localSettings={localSettings}
        onChange={onSettingChange}
      />
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
      <TimeSetting
        settingKey={settingKey}
        value={localSettings[settingKey] || value}
        onChange={(val) => onSettingChange(settingKey, val)}
      />
    );
  }

  return (
    <DefaultSetting
      settingKey={settingKey}
      value={localSettings[settingKey] || value}
      type={typeof value === 'number' ? 'number' : 'text'}
      onChange={(val) => onSettingChange(settingKey, val)}
    />
  );
};
