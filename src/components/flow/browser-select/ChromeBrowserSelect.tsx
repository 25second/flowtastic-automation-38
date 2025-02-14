
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Browser {
  port: number;
  name: string;
  type: string;
}

interface ChromeBrowserSelectProps {
  browsers: Browser[];
  selectedBrowser: number | null;
  setSelectedBrowser: (port: number) => void;
}

export const ChromeBrowserSelect = ({
  browsers,
  selectedBrowser,
  setSelectedBrowser,
}: ChromeBrowserSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Browser</label>
      <Select
        value={selectedBrowser?.toString()}
        onValueChange={(value) => setSelectedBrowser(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select browser" />
        </SelectTrigger>
        <SelectContent>
          {browsers.map((browser) => (
            <SelectItem key={browser.port} value={browser.port.toString()}>
              {browser.name} ({browser.type}) - Port: {browser.port}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
