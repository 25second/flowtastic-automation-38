
import { Computer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActiveSession {
  id: string;
  user_agent: string;
  ip_address: string;
  last_active: string;
}

export function ActiveSessionsSection() {
  const queryClient = useQueryClient();

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

  return (
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
  );
}
