
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { Button } from "@/components/ui/button";
import { DateRangeFilter, UserGrowthDataPoint, DailyActiveDataPoint } from '@/hooks/admin/types';

interface CombinedChartsProps {
  userGrowthData: UserGrowthDataPoint[];
  dailyActiveData: DailyActiveDataPoint[];
  userGrowthDateRange: DateRangeFilter;
  activeDateRange: DateRangeFilter;
  onUserGrowthDateChange: (range: DateRangeFilter) => void;
  onActiveDateChange: (range: DateRangeFilter) => void;
  loading?: boolean;
}

export function CombinedCharts({ 
  userGrowthData, 
  dailyActiveData,
  userGrowthDateRange,
  activeDateRange,
  onUserGrowthDateChange,
  onActiveDateChange,
  loading = false 
}: CombinedChartsProps) {
  const [activeTab, setActiveTab] = useState<'growth' | 'active'>('growth');
  
  const currentData = activeTab === 'growth' ? userGrowthData : dailyActiveData;
  const currentDateRange = activeTab === 'growth' ? userGrowthDateRange : activeDateRange;
  const handleDateChange = activeTab === 'growth' ? onUserGrowthDateChange : onActiveDateChange;
  
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{activeTab === 'growth' ? 'User Growth' : 'Daily Active Users'}</CardTitle>
            <CardDescription>
              {activeTab === 'growth' 
                ? 'Monthly user registration trend' 
                : 'Number of active users per day'}
            </CardDescription>
          </div>
          <DateRangePicker 
            dateRange={currentDateRange} 
            onChange={handleDateChange} 
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'growth' ? 'default' : 'outline'}
            onClick={() => setActiveTab('growth')}
          >
            User Growth
          </Button>
          <Button
            variant={activeTab === 'active' ? 'default' : 'outline'}
            onClick={() => setActiveTab('active')}
          >
            Daily Active Users
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {activeTab === 'growth' ? (
                  <>
                    <Tooltip formatter={(value) => [`${value} users`, 'Registrations']} />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3f51b5" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }}
                    />
                  </>
                ) : (
                  <>
                    <Tooltip formatter={(value) => [`${value} users`, 'Active Users']} />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {currentData.length > 0 
          ? `Showing data from ${currentDateRange.startDate?.toLocaleDateString() || ''} to ${currentDateRange.endDate?.toLocaleDateString() || ''}`
          : 'Select a date range to view data'
        }
      </CardFooter>
    </Card>
  );
}
