
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MathSettingsProps {
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

export const MathSettings = ({ localSettings, onSettingChange }: MathSettingsProps) => {
  const mathSettings = Object.entries(localSettings).filter(([key]) => 
    key !== 'inputs' && key !== 'outputs'
  );

  return (
    <div className="space-y-4">
      {mathSettings.map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => onSettingChange(key, Number(e.target.value))}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};
