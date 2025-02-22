
import { BooleanSetting } from "./settings/BooleanSetting";
import { ArraySetting } from "./settings/ArraySetting";
import { TextSetting } from "./settings/TextSetting";
import { SelectorSetting } from "./settings/SelectorSetting";
import { TimeSetting } from "./settings/TimeSetting";
import { DefaultSetting } from "./settings/DefaultSetting";

interface SettingInputProps {
  settingKey: string;
  value: any;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

export const SettingInput = ({ settingKey, value, localSettings, onSettingChange }: SettingInputProps) => {
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
        <label className="capitalize">{settingKey.replace(/([A-Z])/g, ' $1')}</label>
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
