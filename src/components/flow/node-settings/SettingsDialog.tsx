
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeData } from "@/types/flow";
import { useEffect, useState } from "react";
import { defaultMathSettings } from "./constants";
import { MathSettings } from "./components/MathSettings";
import { OutputSelectors } from "./components/OutputSelectors";
import { GeneralSettings } from "./components/GeneralSettings";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeData: NodeData;
  onSettingsChange: (nodeId: string, settings: Record<string, any>) => void;
  initialSettings?: Record<string, any>;
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
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (nodeData.type?.startsWith('math-')) {
        const defaultSettings = defaultMathSettings[nodeData.type as keyof typeof defaultMathSettings] || {};
        setLocalSettings({
          ...defaultSettings,
          ...initialSettings
        });
      } else {
        const filteredSettings = { ...initialSettings };
        delete filteredSettings.inputs;
        delete filteredSettings.outputs;
        setLocalSettings(filteredSettings);
        setSelectedOutputs(initialSettings?.selectedOutputs || []);
      }
    }
  }, [isOpen, initialSettings, nodeData.type]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    
    const finalSettings = {
      ...newSettings,
      inputs: initialSettings?.inputs,
      outputs: initialSettings?.outputs
    };
    onSettingsChange(nodeId, finalSettings);
  };

  const handleOutputToggle = (outputId: string) => {
    const newOutputs = selectedOutputs.includes(outputId)
      ? selectedOutputs.filter(id => id !== outputId)
      : [...selectedOutputs, outputId];
    
    setSelectedOutputs(newOutputs);
    handleSettingChange('selectedOutputs', newOutputs);
  };

  if (!nodeData || !isOpen) {
    return null;
  }

  const isMathNode = nodeData.type?.startsWith('math-');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {nodeData.label || nodeData.type || 'Node'} Settings
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            {isMathNode ? (
              <MathSettings
                localSettings={localSettings}
                onSettingChange={handleSettingChange}
              />
            ) : (
              <>
                {nodeData.type === 'generate-person' && (
                  <OutputSelectors
                    selectedOutputs={selectedOutputs}
                    onOutputToggle={handleOutputToggle}
                  />
                )}
                <GeneralSettings
                  nodeData={nodeData}
                  localSettings={localSettings}
                  onSettingChange={handleSettingChange}
                />
              </>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
