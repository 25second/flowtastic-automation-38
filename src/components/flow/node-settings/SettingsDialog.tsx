
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SettingInput } from "./SettingInput";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Record<string, any>;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
  label: string;
}

export const SettingsDialog = ({ 
  open, 
  onOpenChange, 
  settings, 
  localSettings, 
  onSettingChange,
  label 
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label} Settings</DialogTitle>
          <DialogDescription>Configure the parameters for this node</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(settings || {}).map(([key, value]) => (
            <div key={key}>
              <SettingInput
                settingKey={key}
                value={value}
                localSettings={localSettings}
                onSettingChange={onSettingChange}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
