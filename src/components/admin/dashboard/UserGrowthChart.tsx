
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { DateRangeFilter, UserGrowthDataPoint } from '@/hooks/admin/types';

interface UserGrowthChartProps {
  chartData: UserGrowthDataPoint[];
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  loading?: boolean;
}

export function UserGrowthChart({ 
  chartData, 
  dateRange, 
  onDateRangeChange, 
  loading = false 
}: UserGrowthChartProps) {
  
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user registration trend</CardDescription>
        </div>
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={onDateRangeChange} 
        />
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} users`, 'Registrations']} />
                <Line 
                  type="monotone"
                  dataKey="users" 
                  stroke="#3f51b5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {chartData.length > 0 
          ? `Showing data from ${dateRange.startDate?.toLocaleDateString() || ''} to ${dateRange.endDate?.toLocaleDateString() || ''}`
          : 'Select a date range to view user registration data'
        }
      </CardFooter>
    </Card>
  );
}
