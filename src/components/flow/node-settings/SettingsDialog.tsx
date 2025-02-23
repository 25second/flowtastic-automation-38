
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingInput } from "./SettingInput";
import { FlowNodeData } from "@/types/flow";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeData: FlowNodeData;
  onSettingsChange: (nodeId: string, settings: Record<string, any>) => void;
  initialSettings: Record<string, any>;
}

// Определяем опции для каждого поля
const settingOptions = {
  gender: ['male', 'female', 'any'],
  nationality: ['US', 'UK', 'CA', 'AU', 'FR', 'DE', 'ES', 'IT', 'BR', 'RU'],
  country: ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Spain', 'Italy', 'Brazil', 'Russia']
};

export const SettingsDialog = ({
  isOpen,
  onClose,
  nodeId,
  nodeData,
  onSettingsChange,
  initialSettings,
}: SettingsDialogProps) => {
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (nodeData?.settings) {
      setLocalSettings({ ...nodeData.settings, type: nodeData.type });
    } else {
      setLocalSettings({ type: nodeData?.type || 'default' });
    }
  }, [nodeData, isOpen]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(nodeId, newSettings);
  };

  if (!nodeData) {
    return null;
  }

  const renderSettingInput = (key: string, value: any) => {
    if (nodeData.type === 'generate-person') {
      if (key === 'emailDomain') {
        return (
          <SettingInput
            key={key}
            settingKey={key}
            value={value}
            localSettings={localSettings}
            onSettingChange={handleSettingChange}
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
            onSettingChange={handleSettingChange}
            options={settingOptions[key as keyof typeof settingOptions]}
          />
        );
      }
    }

    return (
      <SettingInput
        key={key}
        settingKey={key}
        value={value}
        localSettings={localSettings}
        onSettingChange={handleSettingChange}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {nodeData.label || nodeData.type || 'Node'} Settings
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            {Object.entries(nodeData.settings || {}).map(([key, value]) => 
              renderSettingInput(key, value)
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
