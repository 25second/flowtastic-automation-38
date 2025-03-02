
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from '@/components/auth/AuthProvider';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { PrivateRoute } from '@/components/auth/PrivateRoute';

import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Canvas from '@/pages/Canvas';
import Settings from '@/pages/Settings';
import Servers from '@/pages/Servers';
import BotLaunch from '@/pages/BotLaunch';
import Tables from '@/pages/Tables';
import Profile from '@/pages/Profile';
import FileManager from '@/pages/FileManager';
import AdminPanel from '@/pages/AdminPanel';
import UsersPage from '@/pages/admin/UsersPage';
import PaymentsPage from '@/pages/admin/PaymentsPage';
import PlansPage from '@/pages/admin/PlansPage';
import PromoCodesPage from '@/pages/admin/PromoCodesPage';
import NotFound from '@/pages/NotFound';

import '@/App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="canvas" element={<Canvas />} />
              <Route path="canvas/:id" element={<Canvas />} />
              <Route path="settings" element={<Settings />} />
              <Route path="servers" element={<Servers />} />
              <Route path="bot-launch" element={<BotLaunch />} />
              <Route path="tables" element={<Tables />} />
              <Route path="profile" element={<Profile />} />
              <Route path="files" element={<FileManager />} />
            </Route>
            
            {/* Admin routes - protected by role */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/plans" element={<PlansPage />} />
              <Route path="/admin/promo-codes" element={<PromoCodesPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
