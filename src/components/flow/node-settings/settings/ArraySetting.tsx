
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArraySettingProps {
  settingKey: string;
  value: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const ArraySetting = ({ settingKey, value, selectedValue, onChange }: ArraySettingProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
      <Select
        value={selectedValue}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select options" />
        </SelectTrigger>
        <SelectContent>
          {value.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
