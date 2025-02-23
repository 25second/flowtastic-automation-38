
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
            {Object.entries(nodeData.settings || {}).map(([key, value]) => (
              <SettingInput
                key={key}
                settingKey={key}
                value={value}
                localSettings={localSettings}
                onSettingChange={handleSettingChange}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
