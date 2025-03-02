
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Users, BarChart as BarChartIcon, Activity } from 'lucide-react';

export default function AdminPanel() {
  const [userCount, setUserCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sample data for the chart
  const chartData = [
    { name: 'Jan', users: 10 },
    { name: 'Feb', users: 15 },
    { name: 'Mar', users: 25 },
    { name: 'Apr', users: 30 },
    { name: 'May', users: 22 },
    { name: 'Jun', users: 40 },
  ];

  // Fetch user statistics on component mount
  useEffect(() => {
    async function fetchUserStats() {
      try {
        setLoading(true);
        
        // Get user count
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Get recent registrations
        const { data: recentData, error: recentError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (recentError) throw recentError;
        
        setUserCount(count || 0);
        setRecentUsers(recentData || []);
      } catch (error: any) {
        console.error('Error fetching user stats:', error);
        toast.error('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserStats();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? '...' : userCount}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Placeholder for active sessions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workspace Data</CardTitle>
                <BarChartIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Placeholder for workspace metrics</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registration trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3f51b5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              This is a placeholder chart. It will be populated with real data in future updates.
            </CardFooter>
          </Card>
          
          {/* Recent Registrations */}
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
          
          {/* Additional chart/list placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Additional Chart</CardTitle>
                <CardDescription>Reserved for future metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Chart placeholder</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional List</CardTitle>
                <CardDescription>Reserved for future data</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">List placeholder</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
