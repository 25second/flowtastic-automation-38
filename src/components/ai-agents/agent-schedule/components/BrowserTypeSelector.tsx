
import { BrowserType } from '../hooks/useAgentSchedule';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BrowserTypeSelectorProps {
  browserType: BrowserType;
  onBrowserTypeChange: (value: BrowserType) => void;
}

export function BrowserTypeSelector({ browserType, onBrowserTypeChange }: BrowserTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="browserType">Browser Type</Label>
      <Select value={browserType} onValueChange={(value) => onBrowserTypeChange(value as BrowserType)}>
        <SelectTrigger id="browserType">
          <SelectValue placeholder="Select browser" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="linkenSphere">Linken Sphere</SelectItem>
          <SelectItem value="dolphin">Dolphin Anty</SelectItem>
          <SelectItem value="octoBrowser">Octo Browser</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
