
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverToken: string;
  setServerToken: (token: string) => void;
  onRegister: () => void;
}

export const ServerDialog = ({ 
  open, 
  onOpenChange, 
  serverToken, 
  setServerToken, 
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
              placeholder="Enter server token"
              value={serverToken}
              onChange={(e) => setServerToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onRegister();
                }
              }}
            />
          </div>
          <Button onClick={onRegister}>Connect Server</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
