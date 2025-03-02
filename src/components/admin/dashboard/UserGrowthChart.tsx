
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface UserGrowthChartProps {
  chartData: Array<{
    name: string;
    users: number;
  }>;
}

export function UserGrowthChart({ chartData }: UserGrowthChartProps) {
  return (
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
  );
}
