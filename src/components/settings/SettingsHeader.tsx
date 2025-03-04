
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SettingsHeaderProps {
  onSave?: () => void;
}

export const SettingsHeader = ({
  onSave
}: SettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Settings</h1>
      {onSave && (
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      )}
    </div>
  );
};
