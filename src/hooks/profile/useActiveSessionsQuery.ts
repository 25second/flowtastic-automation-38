
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveSession {
  id: string;
  user_agent: string;
  ip_address: string;
  last_active: string;
}

export const useActiveSessionsQuery = () => {
  return useQuery({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_active', { ascending: false });

      if (error) throw error;
      return data as ActiveSession[];
    }
  });
};
