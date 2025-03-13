
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function AdminRoute() {
  console.log('AdminRoute component is rendering');
  
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const loading = authLoading || roleLoading;
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    console.log('AdminRoute - Auth State:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      isAdmin,
      authLoading, 
      roleLoading,
      loading
    });
    
    if (!loading) {
      if (!session) {
        console.log('AdminRoute - Not authenticated, redirecting to /auth');
        setRedirectPath('/auth');
      } else if (!isAdmin) {
        console.log('AdminRoute - Not admin, redirecting to /dashboard');
        // Only show toast if done loading and confirmed not admin
        if (!roleLoading) {
          toast.error('You need admin privileges to access this page');
        }
        setRedirectPath('/dashboard');
      } else {
        console.log('AdminRoute - Admin access granted');
        setRedirectPath(null);
      }
    }
  }, [session, isAdmin, loading, authLoading, roleLoading]);

  // Show loading indicator while checking authentication and role
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

  // If redirect path is set, navigate there
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  try {
    // If we have a session and isAdmin is true, render the child routes
    console.log('AdminRoute - Rendering admin content');
    return <Outlet />;
  } catch (error) {
    console.error('Error rendering AdminRoute Outlet:', error);
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col p-4">
        <h1 className="text-xl font-semibold text-red-500 mb-4">Ошибка загрузки админ-маршрута</h1>
        <div className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-w-full">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }
}
