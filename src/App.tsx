
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Servers from "./pages/Servers";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/canvas" 
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <PrivateRoute>
                  <Tables />
                </PrivateRoute>
              }
            />
            <Route
              path="/servers"
              element={
                <PrivateRoute>
                  <Servers />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
