
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (data: { serverToken: string; serverName: string }) => void;
  isRegistering: boolean;
}

export function AddServerDialog({ 
  open, 
  onOpenChange, 
  onRegister,
  isRegistering 
}: AddServerDialogProps) {
  const [serverToken, setServerToken] = useState('');
  const [serverName, setServerName] = useState('');

  const handleRegister = () => {
    onRegister({ serverToken, serverName });
    setServerToken('');
    setServerName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Automation Server</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Server name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
            <Input
              placeholder="Enter server token"
              value={serverToken}
              onChange={(e) => setServerToken(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleRegister}
            disabled={!serverToken || isRegistering}
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Server'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
