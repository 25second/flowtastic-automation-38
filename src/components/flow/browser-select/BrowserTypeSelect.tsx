
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BrowserTypeSelectProps {
  browserType: 'chrome' | 'linkenSphere';
  onBrowserTypeChange: (value: 'chrome' | 'linkenSphere') => void;
}

export const BrowserTypeSelect = ({
  browserType,
  onBrowserTypeChange,
}: BrowserTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Browser Type</label>
      <RadioGroup
        value={browserType}
        onValueChange={onBrowserTypeChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="chrome" id="chrome" />
          <Label htmlFor="chrome">Chrome</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="linkenSphere" id="linkenSphere" />
          <Label htmlFor="linkenSphere">Linken Sphere</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
