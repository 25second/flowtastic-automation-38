
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRound, Mail, Key, Link as LinkIcon, Computer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ActiveSession {
  id: string;
  user_agent: string;
  ip_address: string;
  last_active: string;
}

export default function Profile() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [magicLinkPassword, setMagicLinkPassword] = useState("");
  const [showMagicLinkDialog, setShowMagicLinkDialog] = useState(false);
  
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  const { data: activeSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }
      console.log('Fetched sessions:', data);
      return data as ActiveSession[];
    }
  });

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
      toast.success('Session terminated successfully');
    } catch (error: any) {
      toast.error('Failed to terminate session');
      console.error('Error terminating session:', error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      toast.success("Email update initiated. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGenerateMagicLink = async () => {
    try {
      if (!session?.user?.email) throw new Error("No email found");
      
      const { error } = await supabase.auth.signInWithOtp({
        email: session.user.email,
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
    <SidebarProvider>
      <div className="flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <DashboardHeader />
            <div className="flex-1 space-y-4">
              <div className="border-b">
                <div className="container flex-1 items-center space-y-4 py-4 sm:flex sm:space-y-0 sm:space-x-4 md:py-6">
                  <div className="flex items-center space-x-2">
                    <UserRound className="h-8 w-8" />
                    <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                  </div>
                </div>
              </div>

              <div className="container space-y-8 max-w-5xl">
                {/* Email Update */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Update Email
                    </CardTitle>
                    <CardDescription>
                      Change your account email address. You'll need to verify the new email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUpdateEmail}>Update Email</Button>
                  </CardContent>
                </Card>

                {/* Password Update */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your account password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                  </CardContent>
                </Card>

                {/* Magic Link Generation */}
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

                {/* Active Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Computer className="h-5 w-5" />
                      Active Sessions
                    </CardTitle>
                    <CardDescription>
                      View and manage all active sessions for your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessionsLoading ? (
                        <div className="text-center py-4">Loading sessions...</div>
                      ) : activeSessions && activeSessions.length > 0 ? (
                        activeSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">{session.user_agent}</p>
                              <p className="text-sm text-muted-foreground">
                                IP: {session.ip_address}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Last active: {new Date(session.last_active).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                            >
                              Terminate
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No active sessions found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
