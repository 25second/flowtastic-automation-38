
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { AnalyticsEvent, PageView, AnalyticsState } from '@/types/analytics';

export const useAnalytics = () => {
  const { session } = useAuth();
  const location = useLocation();
  const userId = session?.user?.id;
  const timeOnPageRef = useRef<number>(Date.now());
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    isTracking: !!userId,
    sessionStartTime: Date.now(),
    currentPageUrl: location.pathname,
    previousPageUrl: null,
    events: [],
  });

  // Отслеживание смены страницы
  useEffect(() => {
    if (!userId) return;
    
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - timeOnPageRef.current) / 1000);
    
    // Записываем просмотр страницы при переходе на новую страницу
    if (analyticsState.currentPageUrl && analyticsState.currentPageUrl !== location.pathname && timeSpent > 0) {
      trackPageView({
        page_url: analyticsState.currentPageUrl,
        time_spent: timeSpent,
        referrer: analyticsState.previousPageUrl || undefined,
      });
    }
    
    // Обновляем состояние
    setAnalyticsState(prev => ({
      ...prev,
      previousPageUrl: prev.currentPageUrl,
      currentPageUrl: location.pathname,
    }));
    
    // Сбрасываем таймер
    timeOnPageRef.current = currentTime;
  }, [location.pathname, userId]);

  // Отслеживание завершения сессии
  useEffect(() => {
    if (!userId) return;
    
    const handleBeforeUnload = () => {
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - timeOnPageRef.current) / 1000);
      
      if (timeSpent > 0) {
        // Используем navigator.sendBeacon для отправки данных перед закрытием страницы
        const pageView: PageView = {
          page_url: analyticsState.currentPageUrl,
          time_spent: timeSpent,
          referrer: analyticsState.previousPageUrl || undefined,
        };
        
        const data = {
          user_id: userId,
          page_url: pageView.page_url,
          time_spent: pageView.time_spent,
          referrer: pageView.referrer,
          user_agent: navigator.userAgent,
        };
        
        navigator.sendBeacon('/api/track-page-view', JSON.stringify(data));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [analyticsState.currentPageUrl, analyticsState.previousPageUrl, userId]);

  // Функция для отслеживания событий
  const trackEvent = async (event: AnalyticsEvent) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('analytics_events').insert({
        user_id: userId,
        event_type: event.event_type,
        event_data: event.event_data || {},
        page_url: event.page_url || analyticsState.currentPageUrl,
        referrer: event.referrer || analyticsState.previousPageUrl,
        user_agent: navigator.userAgent,
      });
      
      if (error) throw error;
      
      console.log('Analytics event tracked:', event.event_type);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Функция для отслеживания просмотров страниц
  const trackPageView = async (pageView: PageView) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('page_views').insert({
        user_id: userId,
        page_url: pageView.page_url,
        time_spent: pageView.time_spent || 0,
        referrer: pageView.referrer,
        user_agent: navigator.userAgent,
      });
      
      if (error) throw error;
      
      console.log('Page view tracked:', pageView.page_url);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  return {
    trackEvent,
    trackPageView,
    isTracking: analyticsState.isTracking,
  };
};
