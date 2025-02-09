
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Browser {
  port: number;
  name: string;
  type: string;
}

interface BrowserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  browsers: Browser[];
  onConfirm: (selectedPorts: number[]) => void;
}

export const BrowserSelectDialog = ({
  open,
  onOpenChange,
  browsers,
  onConfirm,
}: BrowserSelectDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPorts, setSelectedPorts] = useState<number[]>([]);

  const filteredBrowsers = browsers.filter((browser) =>
    browser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBrowserSelection = (port: number) => {
    setSelectedPorts((prev) =>
      prev.includes(port)
        ? prev.filter((p) => p !== port)
        : [...prev, port]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedPorts);
    setSelectedPorts([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Browsers</DialogTitle>
        </DialogHeader>
        
        <Input
          placeholder="Search browsers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredBrowsers.map((browser) => (
              <div
                key={browser.port}
                className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                  selectedPorts.includes(browser.port)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => toggleBrowserSelection(browser.port)}
              >
                <span>{browser.name}</span>
                {selectedPorts.includes(browser.port) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPorts([]);
              setSearchTerm("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedPorts.length === 0}
          >
            Run Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
