
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setError(null);
      await onRegister();
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Automation Server</DialogTitle>
          <DialogDescription>
            Enter the server token shown in your server console when starting the server.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter server token"
              value={serverToken}
              onChange={(e) => setServerToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <Button onClick={handleRegister}>Connect Server</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
