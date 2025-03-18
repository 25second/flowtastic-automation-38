
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from 'react';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { WindowControls } from '@/components/common/WindowControls';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Workflows from '@/pages/Workflows';
import Canvas from '@/pages/Canvas';
import Settings from '@/pages/Settings';
import Servers from '@/pages/Servers';
import BotLaunch from '@/pages/BotLaunch';
import AIAgents from '@/pages/AIAgents';
import Tables from '@/pages/Tables';
import Profile from '@/pages/Profile';
import FileManager from '@/pages/FileManager';
import NotFound from '@/pages/NotFound';

import '@/App.css';
import { isElectronApp } from './electron';

// Создаем клиент запросов с настройкой обработки ошибок
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
        }
      }
    },
  },
});

// Use HashRouter in Electron to avoid file path issues
const AppRouter = isElectronApp ? require('react-router-dom').HashRouter : Router;

function App() {
  useEffect(() => {
    // Проверка прошлых ошибок для диагностики
    try {
      const lastError = localStorage.getItem('lastError');
      if (lastError) {
        console.warn('Previous error detected:', JSON.parse(lastError));
      }
      
      // Логирование информации о окружении
      console.log('App environment:', {
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD,
        mode: import.meta.env.MODE,
        base: import.meta.env.BASE_URL,
        userAgent: navigator.userAgent
      });
    } catch (e) {
      console.error('Error checking previous errors:', e);
    }
    
    // Отметка момента монтирования
    console.log('App component mounted at:', new Date().toISOString());
    
    return () => {
      console.log('App component unmounting');
    };
  }, []);
  
  return (
    <AppRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AnalyticsProvider>
            <LanguageProvider>
              {isElectronApp && (
                <div className="fixed top-0 right-0 z-50 flex items-center p-2 drag-region">
                  <WindowControls />
                </div>
              )}
              <Routes>
                <Route path="/auth" element={<Auth />} />
                
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<Index />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="workflows" element={<Workflows />} />
                  <Route path="canvas" element={<Canvas />} />
                  <Route path="canvas/:id" element={<Canvas />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="servers" element={<Servers />} />
                  <Route path="bot-launch" element={<BotLaunch />} />
                  <Route path="ai-agents" element={<AIAgents />} />
                  <Route path="tables" element={<Tables />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="files" element={<FileManager />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LanguageProvider>
          </AnalyticsProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AppRouter>
  );
}

export default App;
