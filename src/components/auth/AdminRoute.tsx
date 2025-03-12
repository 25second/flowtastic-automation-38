
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function AdminRoute() {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading, role } = useUserRole();
  const loading = authLoading || roleLoading;
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [forceAdmin, setForceAdmin] = useState<boolean>(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState<boolean>(false);

  // Enhanced direct admin check in the database for troubleshooting
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!session?.user) {
        console.log("No session for admin check");
        setAdminCheckComplete(true);
        return;
      }
      
      try {
        console.log("ADMIN CHECK: Starting direct admin check for user ID:", session.user.id);
        
        // Use select('*') instead of select('role') to get the full record
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (error) {
          console.error('ADMIN CHECK: Direct admin check error:', error);
          toast.error('Ошибка проверки прав администратора');
        } else {
          console.log('ADMIN CHECK: Direct admin check result:', data);
          
          // If admin role found, force access regardless of useUserRole hook
          if (data) {
            console.log('ADMIN CHECK: Admin role confirmed in database, forcing access');
            setForceAdmin(true);
          } else {
            console.log('ADMIN CHECK: Admin role not found in database');
            setForceAdmin(false);
          }
        }
      } catch (e) {
        console.error('ADMIN CHECK: Exception during direct admin check:', e);
        toast.error('Не удалось проверить права администратора');
      } finally {
        setAdminCheckComplete(true);
      }
    };
    
    if (session?.user) {
      checkAdminDirectly();
    } else {
      setAdminCheckComplete(true);
    }
  }, [session]);

  // Effect for determining the redirect route
  useEffect(() => {
    console.log('AdminRoute - State check:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      isAdmin,
      role,
      forceAdmin,
      authLoading, 
      roleLoading,
      loading,
      adminCheckComplete,
      path: window.location.pathname
    });
    
    if (loading || !adminCheckComplete) {
      // Still loading, don't redirect yet
      return;
    }
    
    if (!session) {
      console.log('AdminRoute - Not authenticated, redirecting to /auth');
      setRedirectPath('/auth');
      return;
    }
    
    // Allow access if either isAdmin from hook OR forceAdmin from direct check is true
    if (!isAdmin && !forceAdmin) {
      console.log('AdminRoute - Not admin, redirecting to /dashboard');
      toast.error('Вам необходимы права администратора для доступа к этой странице');
      setRedirectPath('/dashboard');
    } else {
      console.log('AdminRoute - Admin access granted for path:', window.location.pathname);
      setRedirectPath(null);
    }
  }, [session, isAdmin, forceAdmin, loading, authLoading, roleLoading, role, adminCheckComplete]);

  // Show loading indicator while checking auth and admin status
  if (loading || !adminCheckComplete) {
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

  // If we have a session and either isAdmin or forceAdmin is true, show the protected content
  return <Outlet />;
}
