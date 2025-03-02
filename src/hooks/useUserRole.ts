
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
        
        // Query directly checking both tables to debug
        console.log('Checking profiles table for user');
        const profileCheck = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);
          
        console.log('Profile check result:', profileCheck);
        
        // Direct query to user_roles with full data
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')  // Select all columns to see full structure
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          throw error;
        }

        console.log('User role raw data received:', data);
        
        // More robust role extraction
        let userRole: UserRole = 'client'; // Default role
        
        if (data && data.length > 0) {
          // Check structure of returned data
          const roleData = data[0];
          console.log('Role data structure:', roleData);
          
          if (roleData.role === 'admin') {
            console.log('Admin role found in data');
            userRole = 'admin';
          } else {
            console.log('Non-admin role found:', roleData.role);
          }
        } else {
          console.log('No role data found for user');
        }
        
        console.log('Setting final user role to:', userRole);
        setRole(userRole);
      } catch (error: any) {
        console.error('Role verification failed:', error);
        toast.error('Failed to verify your account permissions');
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    console.log('useUserRole hook triggered with session:', !!session);
    fetchUserRole();
  }, [session]);

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  console.log('Current user role state:', { role, isAdmin, isClient, loading });

  return { role, isAdmin, isClient, loading };
}
