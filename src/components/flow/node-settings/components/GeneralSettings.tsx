
import { SettingInput } from "../SettingInput";
import { settingOptions } from "../constants";
import { NodeData } from "@/types/flow";

interface GeneralSettingsProps {
  nodeData: NodeData;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

export const GeneralSettings = ({ nodeData, localSettings, onSettingChange }: GeneralSettingsProps) => {
  const renderSettingInput = (key: string, value: any) => {
    if (key === 'inputs' || key === 'outputs') return null;
    
    if (nodeData.type === 'generate-person') {
      if (key === 'emailDomain') {
        return (
          <SettingInput
            key={key}
            settingKey={key}
            value={value}
            localSettings={localSettings}
            onSettingChange={onSettingChange}
            isEmailDomain={true}
          />
        );
      }
      if (key in settingOptions) {
        return (
          <SettingInput
            key={key}
            settingKey={key}
            value={value}
            localSettings={localSettings}
            onSettingChange={onSettingChange}
            options={settingOptions[key as keyof typeof settingOptions]}
          />
        );
      }
    }

    if (key !== 'selectedOutputs') {
      return (
        <SettingInput
          key={key}
          settingKey={key}
          value={value}
          localSettings={localSettings}
          onSettingChange={onSettingChange}
        />
      );
    }
    return null;
  };

  return (
    <>
      {Object.entries(localSettings || {}).map(([key, value]) => 
        renderSettingInput(key, value)
      )}
    </>
  );
};
