
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

  // Добавим прямую проверку админ прав в базе данных для отладки и как запасной вариант
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!session?.user) return;
      
      try {
        console.log("Checking admin status directly for user:", session.user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');
          
        if (error) {
          console.error('Direct admin check error:', error);
        } else {
          console.log('Direct admin check result:', data);
          // Если роль админа найдена в базе данных, принудительно разрешаем доступ
          if (data && data.length > 0) {
            console.log('Admin role found in database, forcing access');
            setForceAdmin(true);
          } else {
            console.log('Admin role not found in database for this user');
            setForceAdmin(false);
          }
        }
      } catch (e) {
        console.error('Error during direct admin check:', e);
      }
    };
    
    if (session?.user && roleLoading) {
      checkAdminDirectly();
    }
  }, [session, roleLoading]);

  // Эффект для определения маршрута перенаправления
  useEffect(() => {
    console.log('AdminRoute - State:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      isAdmin,
      role,
      forceAdmin,
      authLoading, 
      roleLoading,
      loading
    });
    
    if (!loading) {
      if (!session) {
        console.log('AdminRoute - Not authenticated, redirecting to /auth');
        setRedirectPath('/auth');
      } else if (!isAdmin && !forceAdmin) {
        console.log('AdminRoute - Not admin, redirecting to /dashboard');
        // Показываем уведомление только если загрузка завершена и точно не админ
        if (!roleLoading) {
          toast.error('Вам необходимы права администратора для доступа к этой странице');
        }
        setRedirectPath('/dashboard');
      } else {
        console.log('AdminRoute - Admin access granted');
        setRedirectPath(null);
      }
    }
  }, [session, isAdmin, forceAdmin, loading, authLoading, roleLoading, role]);

  // Показываем индикатор загрузки, пока проверяем аутентификацию и роль
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

  // Если установлен путь перенаправления, переходим по нему
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Если у нас есть сеанс и isAdmin или forceAdmin равны true, отображаем дочерние маршруты
  return <Outlet />;
}
