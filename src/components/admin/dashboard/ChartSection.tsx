
import { CombinedCharts } from '@/components/admin/dashboard/CombinedCharts';
import { DateRangeFilter } from '@/hooks/useAdminStats';
import { DailyActiveDataPoint, UserGrowthDataPoint } from '@/hooks/admin/types';

interface ChartSectionProps {
  userGrowthData: UserGrowthDataPoint[];
  dailyActiveData: DailyActiveDataPoint[];
  userGrowthDateRange: DateRangeFilter;
  activeDateRange: DateRangeFilter;
  onUserGrowthDateChange: (range: DateRangeFilter) => void;
  onActiveDateChange: (range: DateRangeFilter) => void;
  loading?: boolean;
}

export function ChartSection({
  userGrowthData,
  dailyActiveData,
  userGrowthDateRange,
  activeDateRange,
  onUserGrowthDateChange,
  onActiveDateChange,
  loading
}: ChartSectionProps) {
  return (
    <CombinedCharts
      userGrowthData={userGrowthData || []}
      dailyActiveData={dailyActiveData || []}
      userGrowthDateRange={userGrowthDateRange}
      activeDateRange={activeDateRange}
      onUserGrowthDateChange={onUserGrowthDateChange}
      onActiveDateChange={onActiveDateChange}
      loading={loading}
    />
  );
}
