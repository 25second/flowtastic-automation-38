
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { ChartSection } from '@/components/admin/dashboard/ChartSection';
import { DateRangeFilter } from '@/hooks/useAdminStats';
import { UserGrowthDataPoint, DailyActiveDataPoint } from '@/hooks/admin/types';

interface MainStatsProps {
  userCount: number;
  onlineUsersCount: number;
  userGrowthData: UserGrowthDataPoint[];
  dailyActiveData: DailyActiveDataPoint[];
  userGrowthDateRange: DateRangeFilter;
  activeDateRange: DateRangeFilter;
  onUserGrowthDateChange: (range: DateRangeFilter) => void;
  onActiveDateChange: (range: DateRangeFilter) => void;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export function MainStats({
  userCount,
  onlineUsersCount,
  userGrowthData,
  dailyActiveData,
  userGrowthDateRange,
  activeDateRange,
  onUserGrowthDateChange,
  onActiveDateChange,
  onRefresh,
  loading
}: MainStatsProps) {
  return (
    <>
      {/* Stats Cards */}
      <StatsCards 
        userCount={userCount}
        onlineUsersCount={onlineUsersCount}
        loading={loading}
        onRefresh={onRefresh}
      />
      
      {/* Combined Charts */}
      <ChartSection
        userGrowthData={userGrowthData}
        dailyActiveData={dailyActiveData}
        userGrowthDateRange={userGrowthDateRange}
        activeDateRange={activeDateRange}
        onUserGrowthDateChange={onUserGrowthDateChange}
        onActiveDateChange={onActiveDateChange}
        loading={loading}
      />
    </>
  );
}
