
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MousePointer } from "lucide-react";
import { toast } from "sonner";

interface SettingInputProps {
  settingKey: string;
  value: any;
  localSettings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

export const SettingInput = ({ settingKey, value, localSettings, onSettingChange }: SettingInputProps) => {
  const [isMouseSelectOpen, setIsMouseSelectOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseSelect = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);

      // Ensure URL has proper protocol
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;

      // First attempt to open the URL in a new window
      const newWindow = window.open(fullUrl, '_blank');
      if (!newWindow) {
        throw new Error('Popup was blocked. Please allow popups and try again.');
      }

      // Then create a new browser page for selection
      const response = await fetch('/api/workflow/mouse-select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fullUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize mouse selection');
      }

      const { selector } = await response.json();
      if (selector) {
        onSettingChange(settingKey, selector);
        setIsMouseSelectOpen(false);
        toast.success("Element selected successfully!");
      }
    } catch (error) {
      console.error('Mouse selection error:', error);
      toast.error(error.message || 'Failed to start element selection');
    } finally {
      setIsLoading(false);
    }
  };

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={settingKey}
          checked={localSettings[settingKey] || false}
          onCheckedChange={(checked) => onSettingChange(settingKey, checked)}
        />
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Select
          value={Array.isArray(localSettings[settingKey]) ? localSettings[settingKey].join(',') : ''}
          onValueChange={(val) => onSettingChange(settingKey, val.split(','))}
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
  }

  if (settingKey === 'selector') {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <div className="flex gap-2">
          <Input
            type={typeof value === 'number' ? 'number' : 'text'}
            id={settingKey}
            value={localSettings[settingKey] || value}
            onChange={(e) => onSettingChange(settingKey, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsMouseSelectOpen(true)}
            title="Select element with mouse"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
        </div>

        <Sheet open={isMouseSelectOpen} onOpenChange={setIsMouseSelectOpen}>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Select Element with Mouse</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Enter URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleMouseSelect} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Opening...' : 'Start Selection'}
              </Button>
              <div className="text-sm text-muted-foreground mt-4">
                Instructions:
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li>Enter the URL of the page where you want to select an element</li>
                  <li>Click "Start Selection" to open the page</li>
                  <li>Hold Shift and click on the desired element</li>
                  <li>The selector will be automatically copied back to the settings</li>
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="space-y-2">
        <Label className="capitalize">{settingKey.replace(/([A-Z])/g, ' $1')}</Label>
        <div className="pl-4 space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <SettingInput
                settingKey={`${settingKey}.${subKey}`}
                value={subValue}
                localSettings={localSettings}
                onSettingChange={onSettingChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (settingKey === 'time') {
    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <Input
          type="time"
          id={settingKey}
          value={localSettings[settingKey] || value}
          onChange={(e) => onSettingChange(settingKey, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="capitalize">
        {settingKey.replace(/([A-Z])/g, ' $1')}
      </Label>
      <Input
        type={typeof value === 'number' ? 'number' : 'text'}
        id={settingKey}
        value={localSettings[settingKey] || value}
        onChange={(e) => onSettingChange(settingKey, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
};
