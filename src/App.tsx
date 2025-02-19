
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Servers from "@/pages/Servers";
import Tables from "@/pages/Tables";
import Canvas from "@/pages/Canvas";
import BotLaunch from "@/pages/BotLaunch";
import NotFound from "@/pages/NotFound";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/bot-launch" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/canvas" element={
                <PrivateRoute>
                  <Canvas />
                </PrivateRoute>
              } />
              <Route path="/bot-launch" element={
                <PrivateRoute>
                  <BotLaunch />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/servers" element={
                <PrivateRoute>
                  <Servers />
                </PrivateRoute>
              } />
              <Route path="/tables" element={
                <PrivateRoute>
                  <Tables />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
