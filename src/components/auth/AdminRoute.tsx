
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function AdminRoute() {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading, role } = useUserRole();
  const loading = authLoading || roleLoading;
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    console.log('AdminRoute - Full state:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      authLoading, 
      roleLoading,
      role,
      isAdmin,
      loading
    });
    
    if (!loading) {
      if (!session) {
        console.log('AdminRoute - Not authenticated, redirecting to /auth');
        setRedirectPath('/auth');
      } else if (!isAdmin) {
        console.log('AdminRoute - Not admin, redirecting to /auth');
        // Show error toast only when we're sure the role has been fetched
        if (!roleLoading) {
          toast.error('You need admin privileges to access this page');
        }
        setRedirectPath('/auth');
      } else {
        console.log('AdminRoute - Admin access granted');
        setRedirectPath(null);
      }
    }
  }, [session, isAdmin, loading, authLoading, roleLoading, role]);

  // Forcefully check permission with Supabase on component mount
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!session?.user) return;
      
      try {
        console.log('Directly checking admin status for user:', session.user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
          
        if (error) {
          console.error('Direct admin check error:', error);
        }
        
        console.log('Direct admin check result:', data);
        
        if (data && data.role === 'admin') {
          console.log('Direct check confirms admin role');
        } else {
          console.log('Direct check does not confirm admin role');
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

  // If we got here and have a session and isAdmin is true, render the child routes
  if (session && isAdmin) {
    return <Outlet />;
  }

  // Default fallback - shouldn't reach here but just in case
  return <Navigate to="/auth" replace />;
}
