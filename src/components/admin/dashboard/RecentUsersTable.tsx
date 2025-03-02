
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentUsersTableProps {
  recentUsers: any[];
  loading: boolean;
  formatDate: (dateString: string) => string;
}

export function RecentUsersTable({ recentUsers, loading, formatDate }: RecentUsersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>Latest user registrations in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading user data...</p>
        ) : recentUsers.length === 0 ? (
          <p>No user registrations found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Telegram</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{user.telegram || 'N/A'}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing the 10 most recent user registrations.
      </CardFooter>
    </Card>
  );
}
