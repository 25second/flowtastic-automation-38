
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
        console.log('ROLE HOOK: No session, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('ROLE HOOK: Fetching role for user ID:', session.user.id);
        
        // Direct query to user_roles table with optimized query
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('ROLE HOOK: Error fetching user role:', error);
          throw error;
        }

        console.log('ROLE HOOK: User role data received:', data);
        
        if (data && data.role) {
          console.log('ROLE HOOK: Setting user role to:', data.role);
          setRole(data.role as UserRole);
        } else {
          console.log('ROLE HOOK: No role found, defaulting to client');
          setRole('client');
        }
      } catch (error: any) {
        console.error('ROLE HOOK: Role verification failed:', error);
        toast.error('Не удалось проверить права доступа к аккаунту');
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    console.log('ROLE HOOK: Hook triggered with session:', !!session);
    setLoading(true); // Reset loading state when session changes
    fetchUserRole();
  }, [session]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('ROLE HOOK: Current user role state:', { role, isAdmin, isClient, loading });

  return { role, isAdmin, isClient, loading };
}
