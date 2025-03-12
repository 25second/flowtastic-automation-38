
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
        
        // Direct approach to query user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle(); // Use maybeSingle to avoid array handling

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
        toast.error('Failed to verify your account permissions');
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    console.log('useUserRole hook triggered with session:', !!session);
    setLoading(true); // Reset loading state when session changes
    fetchUserRole();
  }, [session]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('Current user role state:', { role, isAdmin, isClient, loading });

  return { role, isAdmin, isClient, loading };
}
