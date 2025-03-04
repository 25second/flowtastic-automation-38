
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MagicLinkSectionProps {
  userEmail?: string | null;
}

export const MagicLinkSection = ({ userEmail }: MagicLinkSectionProps) => {
  const [magicLinkPassword, setMagicLinkPassword] = useState("");
  const [showMagicLinkDialog, setShowMagicLinkDialog] = useState(false);

  const handleGenerateMagicLink = async () => {
    try {
      if (!userEmail) throw new Error("No email found");
      
      const { error } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          data: {
            redirectTo: window.location.origin
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Magic link sent to your email");
      setShowMagicLinkDialog(false);
      setMagicLinkPassword("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Generate Magic Link
        </CardTitle>
        <CardDescription>
          Generate a one-time login link for quick access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={showMagicLinkDialog} onOpenChange={setShowMagicLinkDialog}>
          <DialogTrigger asChild>
            <Button>Generate Magic Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Password</DialogTitle>
              <DialogDescription>
                Enter your password to generate a magic link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="magicLinkPassword">Password</Label>
                <Input
                  id="magicLinkPassword"
                  type="password"
                  value={magicLinkPassword}
                  onChange={(e) => setMagicLinkPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateMagicLink}>Generate Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
