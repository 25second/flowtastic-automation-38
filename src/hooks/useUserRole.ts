
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'client';

export function useUserRole() {
  const { session } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!session?.user) {
        console.log('No session, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching role for user ID:', session.user.id);
        
        // Прямой запрос к таблице user_roles
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle(); // Используем maybeSingle чтобы избежать обработки массива

        if (error) {
          console.error('Error fetching user role:', error);
          throw error;
        }

        console.log('User role data received:', data);
        
        if (data && data.role) {
          console.log('Setting user role to:', data.role);
          setRole(data.role as UserRole);
        } else {
          console.log('No role found, defaulting to client');
          setRole('client');
        }
      } catch (error: any) {
        console.error('Role verification failed:', error);
        toast.error('Не удалось проверить права доступа к аккаунту');
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    console.log('useUserRole hook triggered with session:', !!session);
    setLoading(true); // Сбрасываем состояние загрузки при изменении сессии
    fetchUserRole();
  }, [session]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('Current user role state:', { role, isAdmin, isClient, loading });

  return { role, isAdmin, isClient, loading };
}
