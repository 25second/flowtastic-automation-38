
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReadModeSettingProps {
  settingKey: string;
  value: string;
  onChange: (value: string) => void;
}

export const ReadModeSetting = ({ settingKey, value, onChange }: ReadModeSettingProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey}>Read Mode</Label>
      <Select 
        value={value || 'sequential'} 
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select read mode..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sequential">Sequential</SelectItem>
          <SelectItem value="random">Random</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
