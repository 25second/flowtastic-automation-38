
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BrowserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servers: string[];
  selectedServer: string | null;
  onServerSelect: (server: string) => void;
  browsers: Array<{port: number, name: string, type: string}>;
  selectedBrowser: number | null;
  onBrowserSelect: (port: number) => void;
  onConfirm: () => Promise<void>;
}

export const BrowserSelectDialog = ({
  open,
  onOpenChange,
  servers,
  selectedServer,
  onServerSelect,
  browsers,
  selectedBrowser,
  onBrowserSelect,
  onConfirm,
}: BrowserSelectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Browser</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Server</label>
            <Select
              value={selectedServer || undefined}
              onValueChange={onServerSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server} value={server}>
                    {server}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Browser</label>
            <Select
              value={selectedBrowser?.toString()}
              onValueChange={(value) => onBrowserSelect(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select browser" />
              </SelectTrigger>
              <SelectContent>
                {browsers.map((browser) => (
                  <SelectItem key={browser.port} value={browser.port.toString()}>
                    {browser.name} ({browser.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={onConfirm} 
            className="w-full"
            disabled={!selectedBrowser}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
