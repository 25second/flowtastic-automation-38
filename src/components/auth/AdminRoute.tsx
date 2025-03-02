
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function AdminRoute() {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const loading = authLoading || roleLoading;

  useEffect(() => {
    console.log('AdminRoute - Auth state:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      authLoading, 
      roleLoading,
      isAdmin 
    });
    
    if (!loading && !session) {
      console.log('AdminRoute - Not authenticated, redirecting to /auth');
    }
    
    if (!loading && session && !isAdmin) {
      console.log('AdminRoute - Not admin, redirecting to /auth');
      toast.error('You need admin privileges to access this page');
    }
  }, [session, isAdmin, loading, authLoading, roleLoading]);

  // Show loading indicator while checking authentication and role
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not an admin, redirect to login or unauthorized page
  if (!session || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
}
