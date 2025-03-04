
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Computer } from "lucide-react";

interface ActiveSession {
  id: string;
  user_agent: string;
  ip_address: string;
  last_active: string;
}

interface ActiveSessionsSectionProps {
  sessions?: ActiveSession[];
}

export const ActiveSessionsSection = ({ sessions }: ActiveSessionsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Computer className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          View all active sessions for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions?.map((session) => (
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
