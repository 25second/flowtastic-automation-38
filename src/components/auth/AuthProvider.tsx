import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const updateActiveSession = async (userId: string) => {
    if (!userId) return;
    
    try {
      const userAgent = navigator.userAgent;
      
      const { data: existingSessions, error: checkError } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
        
      if (checkError) {
        console.error("Error checking existing session:", checkError);
        return;
      }
      
      if (existingSessions && existingSessions.length > 0) {
        const { error: updateError } = await supabase
          .from('active_sessions')
          .update({ 
            last_active: new Date().toISOString(),
            user_agent: userAgent
          })
          .eq('id', existingSessions[0].id);
          
        if (updateError) {
          console.error("Error updating session:", updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('active_sessions')
          .insert({
            user_id: userId,
            user_agent: userAgent,
            last_active: new Date().toISOString()
          });
          
        if (insertError) {
          console.error("Error creating session:", insertError);
        }
      }
    } catch (e) {
      console.error("Error tracking session:", e);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session:", session);
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/auth');
        return;
      }

      setSession(session);
      setLoading(false);
      
      if (session) {
        console.log("User authenticated:", session.user.id);
        updateActiveSession(session.user.id);
        
        const intervalId = setInterval(() => {
          if (session?.user?.id) {
            updateActiveSession(session.user.id);
          }
        }, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
        
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .then(({ data, error }) => {
            if (error) {
              console.error("Error checking user role:", error);
            } else {
              console.log("User roles:", data);
            }
          });
      }
      
      if (session && location.pathname === '/auth') {
        navigate('/');
      }
      else if (!session && location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      
      if (_event === 'SIGNED_OUT') {
        setSession(null);
        navigate('/auth');
        return;
      }

      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (_event === 'SIGNED_IN') {
        console.log('User signed in successfully');
        if (session?.user?.id) {
          updateActiveSession(session.user.id);
        }
      }

      setSession(session);
      
      if (session && location.pathname === '/auth') {
        navigate('/');
      } else if (!session && location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    const heartbeatInterval = setInterval(() => {
      if (session?.user?.id) {
        updateActiveSession(session.user.id);
      }
    }, 5 * 60 * 1000);

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
      clearInterval(heartbeatInterval);
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
