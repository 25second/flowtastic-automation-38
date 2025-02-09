
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newServerUrl: string;
  setNewServerUrl: (url: string) => void;
  onRegister: () => void;
}

export const ServerDialog = ({ 
  open, 
  onOpenChange, 
  newServerUrl, 
  setNewServerUrl, 
  onRegister 
}: ServerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Automation Server</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter server URL (e.g., http://192.168.1.100:3001)"
              value={newServerUrl}
              onChange={(e) => setNewServerUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onRegister();
                }
              }}
            />
          </div>
          <Button onClick={onRegister}>Add Server</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
