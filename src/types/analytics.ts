
export interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
  referrer?: string;
}

export interface PageView {
  page_url: string;
  time_spent?: number;
  referrer?: string;
}

export interface AnalyticsState {
  isTracking: boolean;
  sessionStartTime: number;
  currentPageUrl: string;
  previousPageUrl: string | null;
  events: AnalyticsEvent[];
}
