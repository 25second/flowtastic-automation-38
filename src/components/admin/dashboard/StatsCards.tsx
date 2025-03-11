
import { Users, BarChart as BarChartIcon, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback } from 'react';
import { toast } from 'sonner';

interface StatsCardsProps {
  userCount: number;
  activeSessionsCount: number;
  loading: boolean;
  onRefresh?: () => Promise<void>;
}

export function StatsCards({ userCount, activeSessionsCount, loading, onRefresh }: StatsCardsProps) {
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      try {
        await onRefresh();
        toast.success("Statistics refreshed");
      } catch (error) {
        toast.error("Failed to refresh statistics");
      }
    }
  }, [onRefresh]);

  return (
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
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={loading}
              className="h-6 w-6"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{loading ? '...' : activeSessionsCount}</div>
          <p className="text-xs text-muted-foreground">Users online in the last 15 minutes</p>
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
  );
}
