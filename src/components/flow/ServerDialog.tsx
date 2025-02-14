
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  onRegister: () => void;
}

export const ServerDialog = ({
  open,
  onOpenChange,
  token,
  setToken,
  onRegister,
}: ServerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Server</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="token">Server Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter server token"
            />
          </div>
          <Button onClick={onRegister} className="w-full">
            Register Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
