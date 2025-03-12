
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export function AdminRoute() {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const loading = authLoading || roleLoading;

  console.log('AdminRoute Check:', {
    hasSession: !!session,
    isAdmin,
    authLoading,
    roleLoading,
    path: window.location.pathname
  });

  // Show loading indicator while checking auth and admin status
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Проверка прав администратора...</p>
        </div>
      </div>
    );
  }

  // If no session, redirect to auth
  if (!session) {
    console.log('AdminRoute: No session, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If not admin, show error and redirect
  if (!isAdmin) {
    console.log('AdminRoute: Not admin, redirecting to /dashboard');
    toast.error('У вас нет прав администратора для доступа к этой странице');
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin, allow access
  console.log('AdminRoute: Access granted for admin');
  return <Outlet />;
}
