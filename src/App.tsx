
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from '@/components/auth/AuthProvider';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { WindowControls } from '@/components/common/WindowControls';
import { LanguageProvider } from '@/contexts/LanguageContext';

import Auth from '@/pages/Auth';
import AdminAuth from '@/pages/AdminAuth';
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
import AdminPanel from '@/pages/AdminPanel';
import UsersPage from '@/pages/admin/UsersPage';
import PaymentsPage from '@/pages/admin/PaymentsPage';
import PlansPage from '@/pages/admin/PlansPage';
import PromoCodesPage from '@/pages/admin/PromoCodesPage';
import AIProvidersPage from '@/pages/admin/AIProvidersPage';
import NotFound from '@/pages/NotFound';

import '@/App.css';
import { isElectronApp } from './electron';

// Create a client
const queryClient = new QueryClient();

// Use HashRouter in Electron to avoid file path issues
const AppRouter = isElectronApp ? require('react-router-dom').HashRouter : Router;

function App() {
  return (
    <AppRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            {isElectronApp && (
              <div className="fixed top-0 right-0 z-50 flex items-center p-2 drag-region">
                <WindowControls />
              </div>
            )}
            <Routes>
              {/* Public routes that don't require authentication */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/auth" element={<AdminAuth />} />
              
              {/* Protected routes */}
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
              
              {/* Admin routes - protected by role and 2FA */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminPanel />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="ai-providers" element={<AIProvidersPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="promo-codes" element={<PromoCodesPage />} />
              </Route>
              
              {/* Alternative admin route paths for compatibility */}
              <Route path="/app/admin" element={<AdminRoute />}>
                <Route index element={<AdminPanel />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="ai-providers" element={<AIProvidersPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="promo-codes" element={<PromoCodesPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AppRouter>
  );
}

export default App;
