
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { DateRangeFilter } from '@/hooks/admin/types';

export interface DailyActiveDataPoint {
  name: string;
  activeUsers: number;
  date: string;
}

interface DailyActiveUsersChartProps {
  chartData: DailyActiveDataPoint[];
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  loading?: boolean;
}

export function DailyActiveUsersChart({ 
  chartData, 
  dateRange, 
  onDateRangeChange, 
  loading = false 
}: DailyActiveUsersChartProps) {
  
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Daily Active Users</CardTitle>
          <CardDescription>Number of active users per day</CardDescription>
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
                <Tooltip formatter={(value) => [`${value} users`, 'Active Users']} />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#10b981" 
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
          : 'Select a date range to view daily active users data'
        }
      </CardFooter>
    </Card>
  );
}
