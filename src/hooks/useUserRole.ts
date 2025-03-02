
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
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching role for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          throw error;
        }

        console.log('User role data received:', data);
        setRole(data?.role as UserRole || 'client');
      } catch (error: any) {
        console.error('Role verification failed:', error);
        toast.error('Failed to verify your account permissions');
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [session]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('Current user role:', role, 'isAdmin:', isAdmin);

  return { role, isAdmin, isClient, loading };
}
