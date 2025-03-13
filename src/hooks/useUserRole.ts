
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export type UserRole = 'client';

export function useUserRole() {
  const { session } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserRole = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for role check');
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching role for user ID:', userId);
      
      // Set default client role
      setRole('client');
      
    } catch (error: any) {
      console.error('Role verification failed:', error);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkUserRole() {
      setLoading(true);
      
      if (!session?.user) {
        console.log('No session, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      await fetchUserRole(session.user.id);
    }

    checkUserRole();
  }, [session, fetchUserRole]);

  const isClient = role === 'client';

  console.log('Current user role state:', { role, isClient, loading });

  return { role, isClient, loading };
}
