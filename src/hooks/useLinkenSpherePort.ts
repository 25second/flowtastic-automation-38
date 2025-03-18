
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export function useLinkenSpherePort() {
  const { session } = useAuth();
  const [port, setPort] = useState('40080'); // Default port
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.settings?.linkenSpherePort) {
          setPort(data.settings.linkenSpherePort);
        }
      } catch (error) {
        console.error('Error fetching LinkenSphere port:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session?.user?.id]);

  return { port, loading };
}
