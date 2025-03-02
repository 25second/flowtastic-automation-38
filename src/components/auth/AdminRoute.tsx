
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function AdminRoute() {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const loading = authLoading || roleLoading;
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    console.log('AdminRoute - State:', { 
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

  // Direct check of admin status on component mount for debugging
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error('Direct admin check error:', error);
        } else {
          console.log('Direct admin check result:', data);
        }
      } catch (e) {
        console.error('Error during direct admin check:', e);
      }
    };
    
    checkAdminDirectly();
  }, [session]);

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

  // If redirect path is set, navigate there
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // If we have a session and isAdmin is true, render the child routes
  return <Outlet />;
}
