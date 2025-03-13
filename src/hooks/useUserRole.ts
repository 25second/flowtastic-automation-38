
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'client';

export function useUserRole() {
  const { session } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchUserRole = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for role check');
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching role for user ID:', userId);
      
      // Direct approach to query user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
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
      // Only show toast on final retry
      if (retryCount >= MAX_RETRIES - 1) {
        toast.error('Не удалось проверить права доступа');
      }
      setRole(null);
      
      // Increment retry count if we want to retry
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    async function checkUserRole() {
      setLoading(true); // Reset loading state
      
      if (!session?.user) {
        console.log('No session, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      await fetchUserRole(session.user.id);
    }

    checkUserRole();
  }, [session, fetchUserRole, retryCount]);

  // Retry if needed (with exponential backoff)
  useEffect(() => {
    if (role === null && retryCount > 0 && retryCount < MAX_RETRIES && session?.user) {
      const timeout = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying role fetch (${retryCount}/${MAX_RETRIES}) in ${timeout}ms`);
      
      const timer = setTimeout(() => {
        fetchUserRole(session.user.id);
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [retryCount, role, session, fetchUserRole]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('Current user role state:', { role, isAdmin, isClient, loading });

  return { role, isAdmin, isClient, loading };
}
