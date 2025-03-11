
export interface UserStatsData {
  userCount: number;
  activeSessionsCount: number;
  recentUsers: any[];
  loading: boolean;
  userGrowthData: UserGrowthDataPoint[];
  dailyActiveData: DailyActiveDataPoint[];
}

export interface UserGrowthDataPoint {
  name: string;
  users: number;
  date: string;
}

export interface DailyActiveDataPoint {
  name: string;
  activeUsers: number;
  date: string;
}

export interface DateRangeFilter {
  startDate: Date | undefined;
  endDate: Date | undefined;
}
