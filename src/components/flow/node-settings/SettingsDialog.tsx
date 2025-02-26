import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeData } from "@/types/flow";
import { useEffect, useState } from "react";
import { SettingInput } from "./SettingInput";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeData: NodeData;
  onSettingsChange: (nodeId: string, settings: Record<string, any>) => void;
  initialSettings?: Record<string, any>;
}

const availableOutputs = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'middleName', label: 'Middle Name' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'address', label: 'Address' },
  { id: 'streetAddress', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'zipCode', label: 'Zip Code' },
  { id: 'coordinates', label: 'Coordinates' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'birthDate', label: 'Birth Date' },
  { id: 'age', label: 'Age' },
  { id: 'nationality', label: 'Nationality' },
  { id: 'occupation', label: 'Occupation' },
  { id: 'username', label: 'Username' },
  { id: 'password', label: 'Password' }
];

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
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);

  useEffect(() => {
    if (nodeData?.settings) {
      setLocalSettings({ ...nodeData.settings, type: nodeData.type });
      setSelectedOutputs(nodeData.settings.selectedOutputs || []);
    } else {
      setLocalSettings({ type: nodeData?.type || 'default' });
      setSelectedOutputs([]);
    }
  }, [nodeData, isOpen]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(nodeId, newSettings);
  };

  const handleOutputToggle = (outputId: string) => {
    const newOutputs = selectedOutputs.includes(outputId)
      ? selectedOutputs.filter(id => id !== outputId)
      : [...selectedOutputs, outputId];
    
    setSelectedOutputs(newOutputs);
    handleSettingChange('selectedOutputs', newOutputs);
  };

  if (!nodeData) {
    return null;
  }

  const renderOutputSelectors = () => {
    if (nodeData.type !== 'generate-person') return null;

    return (
      <div className="space-y-4">
        <div className="font-medium text-sm">Generated Data Points</div>
        <div className="grid grid-cols-2 gap-4">
          {availableOutputs.map((output) => (
            <div key={output.id} className="flex items-center space-x-2">
              <Checkbox
                id={output.id}
                checked={selectedOutputs.includes(output.id)}
                onCheckedChange={() => handleOutputToggle(output.id)}
              />
              <Label htmlFor={output.id}>{output.label}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

    if (key !== 'selectedOutputs') {
      return (
        <SettingInput
          key={key}
          settingKey={key}
          value={value}
          localSettings={localSettings}
          onSettingChange={handleSettingChange}
        />
      );
    }
    return null;
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
            {renderOutputSelectors()}
            {Object.entries(nodeData.settings || {}).map(([key, value]) => 
              renderSettingInput(key, value)
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
